/**
 * Presentation rules for a search response.
 *
 * Moved out of `hooks/useSearch.ts` so it can be pinned by the shared corpus: every other cross-client
 * behaviour lives in `lib/`, and a function buried in a React hook is one the native clients cannot
 * discover. It was buried, and both of them shipped without it — a search for "poulet" rendered three
 * rows all reading "Poulet / 100 g / Produit", indistinguishable from one another, where this collapses
 * them to one.
 */

/**
 * The fields deduplication actually reads.
 *
 * Declared narrowly and used generically so a caller keeps its own richer type: the calculator passes
 * `IngredientSuggestion`, and the corpus can exercise the rules with four fields instead of eighteen.
 * That keeps the vector cases readable — a full suggestion per case would be mostly irrelevant JSON.
 */
export interface DeduplicableSuggestion {
  ingredientId: string
  label: string
  lang: string
  productType?: string | null
  /**
   * Part of the identity key, not decoration — see rule 3 in {@link deduplicateByLabel}.
   *
   * Absent on curated ingredients and recipes, which is what makes a brandless product collapse into
   * the curated ingredient of the same name.
   */
  brand?: string | null
}

/**
 * Minimum same-language results before the language preference applies at all.
 *
 * Below this the original server order is kept *whole* — not same-language-first — so a French query
 * that matches only one or two French entries does not push them above better English matches. Three is
 * the point at which the same-language set is a usable list on its own.
 */
export const MIN_SAME_LANG = 3

/** Default cap. The caller over-fetches and this decides how much of it is offered. */
export const MAX_SUGGESTIONS = 30

/**
 * Collapses duplicate labels, preferring the user's language, with recipes pinned on top.
 *
 * Four rules, and the order between them is the contract:
 *
 * 1. **Recipes are never deduplicated away and always lead.** They are the highest-value result — one
 *    tap expands into a whole meal — so they are lifted out before anything else runs.
 * 2. **Language preference, but only above a threshold.** With at least {@link MIN_SAME_LANG} results in
 *    the requested language, those come first and the rest follow; below it the server's own order is
 *    kept whole. This is the rule most likely to be ported wrongly as "always sort by language".
 * 3. **Deduplicate by lowercased, trimmed label *and* brand.** The API returns genuinely distinct
 *    records — one curated ingredient plus N Open Food Facts barcodes — that a user could not tell
 *    apart when the row showed only a name and a weight. Brand joins the key because it is now on the
 *    row: two products of the same name from different brands are separate things to add, while the
 *    same name *and* the same brand is still noise. A brandless product keys on the label alone, so it
 *    collapses into the curated ingredient of that name — which is what should win.
 * 4. **Cap the result.** Recipes count toward the cap but are never dropped by it, so a response of
 *    nothing but recipes can exceed it. That is deliberate: dropping a recipe to honour a display cap
 *    would lose the best result to make room for a worse one.
 *
 * A note on where this belongs, kept because it is a live question and not a rhetorical one: the
 * duplicates exist because the API returns near-identical products, and deduplicating server-side would
 * serve every client at once. This is still the right place for *this* rule even so — two genuinely
 * different products can legitimately share a label, and which language a viewer prefers is knowledge
 * only the client has. Fixing the API's relevance would shrink the input, not remove the need.
 */
export function deduplicateByLabel<T extends DeduplicableSuggestion>(
  items: T[],
  preferLang: string,
  maxResults: number = MAX_SUGGESTIONS,
): T[] {
  const recipes = items.filter(i => i.productType === 'recipe')
  const rest = items.filter(i => i.productType !== 'recipe')

  const sameLang = rest.filter(i => i.lang === preferLang)
  const otherLang = rest.filter(i => i.lang !== preferLang)
  const ordered = sameLang.length >= MIN_SAME_LANG ? [...sameLang, ...otherLang] : [...rest]

  // Seeded from the recipes but WITHOUT their labels in `seen`: a recipe and an ingredient sharing a
  // name are two different things to add, so both survive. Only the non-recipe list is deduplicated
  // against itself.
  const seen = new Set<string>()
  const result: T[] = [...recipes]
  for (const item of ordered) {
    const key = identityKey(item)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
    if (result.length === maxResults) break
  }
  return result
}

/**
 * The identity a viewer can actually perceive: name plus brand, case- and whitespace-insensitive.
 *
 * Trimming matters as much as lowercasing — Open Food Facts labels frequently carry a trailing space,
 * and an untrimmed key lets `" tofu "` and `"Tofu"` through as two rows. Brand gets the same treatment,
 * because contributors enter "Bonduelle", "BONDUELLE" and " bonduelle " for the same company.
 *
 * The separator is U+001F (unit separator), chosen because trimming cannot produce it in either half:
 * `("Jus", "Orange")` and `("Jus Orange", null)` are different products and must not collide. A space
 * happens to work too — the brandless key keeps a trailing one — but only by accident, and a port
 * that trimmed the joined key would merge them.
 */
function identityKey(item: DeduplicableSuggestion): string {
  const label = item.label.toLowerCase().trim()
  const brand = (item.brand ?? '').toLowerCase().trim()
  return `${label}\u001F${brand}`
}

/**
 * Category glyph for a curated ingredient, which never has a photo.
 *
 * Open Food Facts supplies a product image for roughly four fifths of its entries; the knowledge base
 * has no image field at all, so a row built only on `imageUrl` gives every packaged product a
 * photograph and every curated ingredient an empty slot — making the industrial result look more
 * authoritative than the reference one. This fills the curated slot from data already on the wire.
 *
 * The vocabulary is closed: 21 values, enumerated in
 * `pocket-nutrition-knowledge/schemas/ingredient.schema.json`. Three are deliberately unmapped and
 * return `null` rather than a poor guess, following the same rule as `servingUnitEmoji` — a wrong icon
 * is worse than none, and a `null` falls back to the neutral thumbnail placeholder the row already has.
 * `sauce` is the notable one: it is the second-largest group, and no glyph reads as "sauce" rather than
 * as a jar, a bottle or honey.
 *
 * Products and recipes are always `other` server-side, so this never distinguishes a product from an
 * ingredient — `productType` does that.
 *
 * Pinned entry by entry by the `food-group-icon` suite.
 */
/**
 * Whether tapping a search row should *toggle a selection* rather than add the food immediately.
 *
 * Multi-term search is what makes this question exist. `GET /ingredients/search` reports how many
 * ingredient phrases it split the query into, in the `X-Segment-Count` header; when that is more than
 * one, the person is composing a meal rather than picking a single food, and a tap should accumulate a
 * selection they confirm in one go.
 *
 * **The term count MUST come from that header, never from counting spaces.** The server segments with
 * greedy longest-match probes against the index, so `pomme de terre` is ONE term and `riz poulet pomme`
 * is three. A client that split on whitespace would offer checkboxes for a single potato.
 *
 * **Recipes are the exception, and it is the whole reason this is pinned.** A recipe is not one of the
 * query's terms — it unpacks into a whole meal by itself — so it always adds immediately, multi-term or
 * not. Miss that branch and recipes become silently un-addable the moment a query has two words: no
 * compiler complains, no other test notices, and the highest-value result in the list stops working.
 *
 * Pinned by the `selection-mode` suite of the shared behavioural corpus.
 */
export function shouldToggleSelection(termCount: number, productType?: string | null): boolean {
  if (productType === 'recipe') return false
  return termCount > 1
}

export function foodGroupIcon(foodGroup: string | null | undefined): string | null {
  if (!foodGroup) return null
  return FOOD_GROUP_ICONS[foodGroup] ?? null
}

/**
 * Every glyph is distinct, and that is a constraint rather than a coincidence: two groups sharing one
 * icon would render as the same thing in a list whose whole purpose is telling rows apart. Two
 * near-misses were rejected for collisions elsewhere in the UI — 🍲 already marks a recipe row, so
 * `prepared_dish` takes 🍱; and 🥛 is the `glass` serving unit, so `dairy` takes 🧀.
 */
const FOOD_GROUP_ICONS: Record<string, string> = {
  meat: '🥩',
  processed_meat: '🥓',
  fish: '🐟',
  shellfish: '🦐',
  egg: '🥚',
  dairy: '🧀',
  vegetable: '🥦',
  fruit: '🍎',
  cereal: '🌾',
  legume: '🫘',
  nut_seed: '🥜',
  fat: '🧈',
  spice_herb: '🌿',
  sweetener: '🍯',
  baked_good: '🥐',
  beverage: '🥤',
  alcohol: '🍷',
  prepared_dish: '🍱',
  // sauce, seaweed and other are intentionally absent — see foodGroupIcon.
}
