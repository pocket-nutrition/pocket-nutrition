export interface NutritionRequest {
  quantity: number
  unit: 'g' | 'ml'
  cookingMethod: string
  measuredState: 'raw' | 'cooked'
  ingredientId?: string
}

export interface NutritionResponse {
  name: string
  quantity: number
  unit: string
  cookingMethod: string
  measuredState: string
  energyKcal: number
  proteinG: number
  fatG: number
  carbohydratesG: number
  fiberG: number | null
  waterG: number | null
  sugarsG: number | null
  calciumMg: number | null
  ironMg: number | null
  sodiumMg: number | null
  confidence: number
  source: 'cache' | 'ml' | 'off_direct' | 'unavailable'
  available: boolean
}

export type Category = 'raw' | 'cooked' | 'dish' | 'vegetable' | 'wine_spirit' | 'industrial'

export interface ReferenceNutrition {
  energyKcal: number
  proteinG: number
  fatG: number
  carbohydratesG: number
}

export interface ShowcaseExample {
  id: string
  title: string
  description: string
  category: Category
  request: NutritionRequest[]
  reference: ReferenceNutrition
  referenceSource: string
}
