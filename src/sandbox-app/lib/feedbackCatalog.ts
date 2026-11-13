// Single source of truth for the guided feedback form: 5 categories of common
// mistakes, each listing specific errors, each with the right value input.
// Category/error codes MUST stay in sync with the api allowlist
// (pocket-nutrition/api FeedbackController ALLOWED_CATEGORIES / ALLOWED_CODES).

export type CurrentValueHint =
  | 'reference_weight'
  | 'display_unit'
  | 'serving_units'
  | 'raw_cooked'
  | 'cooking_method'

export type CorrectionInput =
  | { kind: 'text'; placeholder?: string }
  | { kind: 'number'; suffix?: string }
  | { kind: 'number-unit'; units: string[] }
  | { kind: 'select'; options: { value: string; label: string }[] }

export interface CorrectionError {
  code: string
  label: string
  input: CorrectionInput
  hint?: CurrentValueHint
}

export interface CorrectionCategory {
  code: string
  label: string
  errors: CorrectionError[]
}

// Known serving units (mirror pocket-nutrition/knowledge serving_unit_types.yaml).
export const SERVING_UNITS: { value: string; label: string }[] = [
  { value: 'pinch', label: 'pinch' },
  { value: 'teaspoon', label: 'teaspoon' },
  { value: 'tablespoon', label: 'tablespoon' },
  { value: 'cup', label: 'cup' },
  { value: 'handful', label: 'handful' },
  { value: 'small_handful', label: 'small handful' },
  { value: 'glass', label: 'glass' },
]

// Food groups (mirror ingredient.schema.json food_group enum).
export const FOOD_GROUPS: { value: string; label: string }[] = [
  { value: 'meat', label: 'meat' },
  { value: 'fish', label: 'fish' },
  { value: 'shellfish', label: 'shellfish' },
  { value: 'vegetable', label: 'vegetable' },
  { value: 'cereal', label: 'cereal' },
  { value: 'dairy', label: 'dairy' },
  { value: 'beverage', label: 'beverage' },
  { value: 'egg', label: 'egg' },
  { value: 'fat', label: 'fat' },
  { value: 'fruit', label: 'fruit' },
  { value: 'legume', label: 'legume' },
  { value: 'nut_seed', label: 'nut / seed' },
  { value: 'spice_herb', label: 'spice / herb' },
  { value: 'sweetener', label: 'sweetener' },
  { value: 'baked_good', label: 'baked good' },
  { value: 'sauce', label: 'sauce' },
  { value: 'processed_meat', label: 'processed meat' },
  { value: 'prepared_dish', label: 'prepared dish' },
  { value: 'seaweed', label: 'seaweed' },
  { value: 'alcohol', label: 'alcohol' },
  { value: 'other', label: 'other' },
]

const COOKING_METHODS: { value: string; label: string }[] = [
  { value: 'raw', label: 'raw' },
  { value: 'boiled', label: 'boiled' },
  { value: 'steamed', label: 'steamed' },
  { value: 'grilled', label: 'grilled' },
  { value: 'roasted', label: 'roasted' },
  { value: 'fried', label: 'fried' },
  { value: 'cooked', label: 'cooked (generic)' },
]

export const FEEDBACK_CATEGORIES: CorrectionCategory[] = [
  {
    code: 'nutrition',
    label: 'Nutritional values',
    errors: [
      { code: 'energy', label: 'Energy', input: { kind: 'number', suffix: 'kcal' } },
      { code: 'protein', label: 'Protein', input: { kind: 'number', suffix: 'g' } },
      { code: 'fat', label: 'Fat', input: { kind: 'number', suffix: 'g' } },
      { code: 'carbs', label: 'Carbohydrates', input: { kind: 'number', suffix: 'g' } },
      { code: 'fiber', label: 'Fiber', input: { kind: 'number', suffix: 'g' } },
      { code: 'other_nutrient', label: 'Other nutrient', input: { kind: 'text', placeholder: 'e.g. vitamin C ~ 12 mg' } },
    ],
  },
  {
    code: 'identity',
    label: 'Identity',
    errors: [
      { code: 'name_fr', label: 'Name (French)', input: { kind: 'text', placeholder: 'correct French name' } },
      { code: 'name_en', label: 'Name (English)', input: { kind: 'text', placeholder: 'correct English name' } },
      { code: 'food_group', label: 'Food group', input: { kind: 'select', options: FOOD_GROUPS } },
      { code: 'aliases', label: 'Alternative names / synonyms', input: { kind: 'text', placeholder: 'e.g. pepper, ground pepper' } },
      { code: 'wrong_ingredient', label: 'Wrong ingredient recognized', input: { kind: 'text', placeholder: 'the correct ingredient would be…' } },
    ],
  },
  {
    code: 'measures',
    label: 'Measures & portions',
    errors: [
      { code: 'reference_weight', label: 'Reference weight', input: { kind: 'number-unit', units: ['g', 'ml'] }, hint: 'reference_weight' },
      { code: 'serving_unit', label: 'Missing serving unit (e.g. pinch)', input: { kind: 'select', options: SERVING_UNITS }, hint: 'serving_units' },
      { code: 'display_unit', label: 'Display unit', input: { kind: 'select', options: [{ value: 'g', label: 'grams (g)' }, { value: 'ml', label: 'milliliters (ml)' }] }, hint: 'display_unit' },
      { code: 'serving_mode', label: 'Serving mode', input: { kind: 'select', options: [
        { value: 'item', label: 'by item' },
        { value: 'weight', label: 'by weight' },
        { value: 'volume', label: 'by volume' },
        { value: 'measure', label: 'by measure' },
      ] } },
      { code: 'density', label: 'Density', input: { kind: 'number', suffix: 'g/ml' } },
    ],
  },
  {
    code: 'cooking',
    label: 'Cooking',
    errors: [
      { code: 'yield', label: 'Yield after cooking', input: { kind: 'number', suffix: '%' } },
      { code: 'cooking_method', label: 'Missing cooking method', input: { kind: 'select', options: COOKING_METHODS }, hint: 'cooking_method' },
      { code: 'raw_cooked', label: 'Eaten raw / cooked', input: { kind: 'select', options: [
        { value: 'raw', label: 'raw' },
        { value: 'cooked', label: 'cooked' },
        { value: 'both', label: 'both' },
      ] }, hint: 'raw_cooked' },
    ],
  },
  {
    code: 'other',
    label: 'Other / new information',
    errors: [
      { code: 'free', label: 'Other remark', input: { kind: 'text', placeholder: 'describe the issue or new information' } },
    ],
  },
]
