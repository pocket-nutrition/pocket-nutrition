import type { CookingMethod, IngredientSuggestion } from '../types/api'
import type { MealIngredient } from '../components/ingredient-card/IngredientCard'
import { getYieldFactor } from './yieldFactor'
import { roundHalfUp } from './rounding'

/**
 * One item to add to the meal. Plain search results pass only the suggestion;
 * recipe components carry explicit overrides (their per-person default weight
 * and the cooking method defined by the recipe).
 */
export interface AddItem {
  suggestion: IngredientSuggestion
  cookingMethod?: CookingMethod
  quantityG?: number
}

const COOKING_METHODS: readonly CookingMethod[] = ['raw', 'boiled', 'steamed', 'grilled', 'roasted', 'fried']

/**
 * Translates the server's `typicalState` into the cooking method to open the row with.
 *
 * This is enum translation, not food knowledge: five of Knowledge's seven state values already
 * *are* cooking methods and pass through unchanged, and 'processed' means "eaten as sold", i.e.
 * no cooking transform — which is what 'raw' encodes in this enum.
 *
 * The generic 'cooked' returns null. It says the food is eaten cooked without saying how, and the
 * viewer has no way to choose between boiled and fried without inventing an answer — which is
 * precisely what the deleted label table used to do (it answered 'grilled' when its regexes had no
 * opinion). Roughly 274 ingredients, 8% of the catalogue, sit on that value; they are dropped
 * rather than guessed until the API exposes a resolved `defaultCookingMethod`.
 */
function cookingMethodFor(typicalState: IngredientSuggestion['typicalState']): CookingMethod | null {
  if (typicalState == null || typicalState === 'cooked') return null
  if (typicalState === 'processed') return 'raw'
  return COOKING_METHODS.includes(typicalState) ? typicalState : null
}

/**
 * Builds a meal row from a server suggestion, or returns `null` when the server did not supply
 * the food data the row needs.
 *
 * The viewer carries no food data of its own: there is no label→cooking-method table and no
 * label→portion table any more, and nothing here substitutes a weight or a state when the
 * server omits one. `servingG`, `typicalState` and `portionMeasuredState` are all documented as
 * server-supplied (the API defaults them when Knowledge has no value), so a null is a server
 * contract violation — the item is dropped rather than guessed at. Callers must handle `null`.
 */
export function buildMealIngredient(item: AddItem, index: number): MealIngredient | null {
  const { suggestion, cookingMethod: methodOverride, quantityG } = item
  // `basePortionG` is the anchor every portion control scales from; without it there is no row.
  const base = suggestion.servingG
  if (base == null) return null
  // A recipe component carries its own method, so typicalState is only required without an override.
  const defaultCooking = methodOverride ?? cookingMethodFor(suggestion.typicalState)
  if (defaultCooking == null) return null
  const isCooked = defaultCooking !== 'raw'
  // Whether `base` is a pre- or post-cooking weight decides if the yield factor applies, so it
  // changes the number shown. Recipe weights are pre-cooking weights by definition.
  if (quantityG == null && isCooked && suggestion.portionMeasuredState == null) return null
  const measureRaw = quantityG != null ? isCooked : isCooked && suggestion.portionMeasuredState === 'raw'
  const isMl = quantityG == null && suggestion.displayUnit === 'ml'
  const firstUnit = suggestion.servingUnits?.[0] ?? null
  const quantity = quantityG
    ?? (isMl
      ? roundHalfUp(base)
      : measureRaw ? base : isCooked ? roundHalfUp(base * getYieldFactor(suggestion.yieldFactors ?? {}, defaultCooking)) : base)
  return {
    id: `${suggestion.ingredientId}-${Date.now()}-${index}`,
    label: suggestion.label,
    ingredientId: suggestion.ingredientId,
    cookingMethod: defaultCooking,
    quantity,
    unit: isMl ? 'ml' : 'g',
    measuredState: measureRaw ? 'raw' : isCooked ? 'cooked' : 'raw',
    basePortionG: base,
    portionFactor: 1,
    servingUnits: suggestion.servingUnits ?? [],
    selectedUnit: isMl ? firstUnit : null,
    unitCount: 1,
    displayUnit: isMl ? 'ml' : 'g',
    canEatRaw: suggestion.canEatRaw ?? null,
    yieldFactors: suggestion.yieldFactors ?? {},
    imageUrl: suggestion.imageUrl ?? null,
    servingMode: suggestion.servingMode ?? null,
  }
}

/** Expand a recipe suggestion into the AddItems of its components. */
export function unpackRecipe(recipe: IngredientSuggestion): AddItem[] {
  return (recipe.recipeComponents ?? []).map((c) => ({
    suggestion: c.ingredient,
    cookingMethod: c.cookingMethod,
    quantityG: c.weightG,
  }))
}
