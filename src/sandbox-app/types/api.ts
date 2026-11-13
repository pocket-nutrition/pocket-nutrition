export type CookingMethod = 'raw' | 'boiled' | 'steamed' | 'grilled' | 'roasted' | 'fried'
export type MeasuredState = 'raw' | 'cooked'
export type Unit = 'g' | 'ml'

export interface FoodItemRequest {
  name: string
  quantity: number
  unit: Unit
  cookingMethod: CookingMethod
  measuredState: MeasuredState
  ingredientId?: string
}

export interface NutritionalProfileResponse {
  name: string
  quantity: number
  unit: Unit
  cookingMethod: CookingMethod
  measuredState: MeasuredState
  energyKcal: number
  proteinG: number
  fatG: number
  carbohydratesG: number
  fiberG: number | null
  waterG: number | null
  sugarsG: number | null
  calciumMg: number | null
  ironMg: number | null
  magnesiumMg: number | null
  sodiumMg: number | null
  vitaminCMg: number | null
  saturatedFatG: number | null
  monounsaturatedFatG: number | null
  polyunsaturatedFatG: number | null
  cholesterolMg: number | null
  potassiumMg: number | null
  phosphorusMg: number | null
  zincMg: number | null
  vitaminAUg: number | null
  vitaminDUg: number | null
  vitaminB6Mg: number | null
  vitaminB12Ug: number | null
  niacinMg: number | null
  confidence: number
  source: 'cache' | 'ml' | 'off_direct' | 'unavailable'
  available: boolean
}

export interface ServingUnit {
  unit: string
  labelFr: string
  labelEn?: string
  volumeMl: number
  grams: number
}

export interface RecipeComponent {
  weightG: number
  cookingMethod: CookingMethod
  ingredient: IngredientSuggestion
}

export interface IngredientSuggestion {
  ingredientId: string
  label: string
  lang: string
  productType?: 'ingredient' | 'off_product' | 'recipe' | null
  servingG: number | null
  densityGMl: number | null
  canEatRaw: boolean | null
  canEatCooked: boolean | null
  // Knowledge stores 7 distinct values (counted over ingredients/*.yaml): processed 1685, raw 1411,
  // cooked 274, fried 31, roasted 11, steamed 1, boiled 1. The previous 'raw' | 'cooked' union
  // under-declared it and hid 1729 ingredients whose state the viewer can actually honour —
  // five of these values already *are* CookingMethods. Only the generic 'cooked' stays ambiguous.
  typicalState: 'processed' | 'cooked' | CookingMethod | null
  portionMeasuredState: 'raw' | 'cooked' | null
  nutrition: NutritionalProfileResponse | null
  servingUnits: ServingUnit[]
  displayUnit: 'g' | 'ml' | null
  yieldFactors: Record<string, number> | null
  imageUrl?: string | null
  /** Brand behind an Open Food Facts product; absent for curated ingredients and recipes. */
  brand?: string | null
  /**
   * Knowledge food group, a closed 21-value vocabulary; `'other'` for products and recipes.
   *
   * Read by `foodGroupIcon` to give a curated ingredient a glyph in the thumbnail slot where a product
   * would show its photo.
   */
  foodGroup?: string | null
  servingMode: 'item' | 'weight' | 'volume' | 'measure' | null
  unitLabelFr: string | null
  unitLabelEn: string | null
  recipeComponents?: RecipeComponent[] | null
}

export interface FeedbackCorrection {
  category: string
  code: string
  value?: string
  unit?: string
}

export interface FeedbackRequest {
  name: string
  corrections: FeedbackCorrection[]
  comment?: string
  cookingMethod?: string
  measuredState?: string
  source?: string
}
