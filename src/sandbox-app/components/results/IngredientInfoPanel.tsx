import type { MealIngredient } from '../ingredient-card/IngredientCard'
import type { NutritionalProfileResponse } from '../../types/api'
import { FeedbackDialog } from '../feedback/FeedbackDialog'

interface IngredientInfoPanelProps {
  ingredient: MealIngredient | null
  result: NutritionalProfileResponse
  onClose: () => void
}

// Thin wrapper over the shared FeedbackDialog: the results context always has a
// prediction result, so it passes both the ingredient and the result.
export function IngredientInfoPanel({ ingredient, result, onClose }: IngredientInfoPanelProps) {
  return <FeedbackDialog name={result.name} ingredient={ingredient} result={result} onClose={onClose} />
}
