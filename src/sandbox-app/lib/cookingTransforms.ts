import type { CookingMethod, MeasuredState } from '../types/api'
import { getYieldFactor } from './yieldFactor'
import { roundHalfUp } from './rounding'
import type { MealIngredient } from '../components/ingredient-card/IngredientCard'

export function applyMethodChange(ing: MealIngredient, newMethod: CookingMethod): MealIngredient {
  if (newMethod === 'raw') {
    const rawQty =
      ing.portionFactor > 0
        ? roundHalfUp(ing.basePortionG * ing.portionFactor)
        : ing.measuredState === 'cooked'
          ? roundHalfUp(ing.quantity / getYieldFactor(ing.yieldFactors, ing.cookingMethod))
          : ing.quantity
    return { ...ing, cookingMethod: 'raw', measuredState: 'raw', quantity: rawQty }
  }

  if (ing.portionFactor > 0) {
    const rawBase = ing.basePortionG * ing.portionFactor
    return {
      ...ing,
      cookingMethod: newMethod,
      measuredState: 'cooked',
      quantity: roundHalfUp(rawBase * getYieldFactor(ing.yieldFactors, newMethod)),
    }
  }

  if (ing.measuredState === 'cooked') {
    const rawEquiv = ing.quantity / getYieldFactor(ing.yieldFactors, ing.cookingMethod)
    return {
      ...ing,
      cookingMethod: newMethod,
      quantity: roundHalfUp(rawEquiv * getYieldFactor(ing.yieldFactors, newMethod)),
    }
  }

  return { ...ing, cookingMethod: newMethod }
}

/**
 * Reinterprets the same number as a pre- or post-cooking weight, converting it so it still describes
 * the same food.
 *
 * This is the one control in the UI where the user tells us what their kitchen scale was measuring,
 * and it is the reason a weight can be right or wrong by 15–40% with nothing on screen to say which.
 * 100 g of raw chicken is 70 g grilled; if the user weighed the cooked portion and the app believes it
 * was raw, every nutrient is overstated by the inverse of the yield.
 *
 * Multiply going to `cooked`, divide coming back — the same direction convention as
 * `applyMethodChange`'s branch 1, so the two functions compose without a sign error.
 *
 * Returns the row unchanged when the state already matches, rather than converting twice. That guard
 * is load-bearing, not defensive: a toggle button re-emitting its current value is normal, and without
 * the guard every re-render of a `cooked` row would multiply the weight by the yield again.
 *
 * Was inline in IngredientCard for its whole life, unreachable from a test and invisible to the two
 * native clients — the same trap `stepRawWeight` fell into. Pinned by the `switch-measured-state`
 * suite of the shared behavioural corpus.
 */
export function switchMeasuredState(ing: MealIngredient, to: MeasuredState): MealIngredient {
  if (ing.measuredState === to) return ing
  const factor = getYieldFactor(ing.yieldFactors, ing.cookingMethod)
  const quantity = to === 'cooked'
    ? roundHalfUp(ing.quantity * factor)
    : roundHalfUp(ing.quantity / factor)
  return { ...ing, measuredState: to, quantity }
}
