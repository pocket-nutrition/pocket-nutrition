import { useState, useEffect } from 'react'
import type { MealIngredient } from '../components/ingredient-card/IngredientCard'
import type { NutritionalProfileResponse } from '../types/api'

const DEBOUNCE_MS = 600

/**
 * Live nutrition preview for the meal under construction.
 *
 * The request states each ingredient exactly as the user set it — real quantity, real unit, real
 * measuredState — and the response is displayed as received. Nothing is recomputed here.
 *
 * It used to work the other way round: it asked for a fixed `quantity: 100`, replaced measuredState
 * with `cookingMethod === 'raw' ? 'raw' : 'cooked'`, then scaled the answer client-side through its
 * own copy of the yield factor. Three defects, all producing wrong numbers rather than missing ones:
 *
 *  - it discarded the user's measuredState, so someone who weighed an ingredient raw and then cooked
 *    it was reported as having weighed it cooked — and the yield was applied a second time locally;
 *  - the final submit (App.handleSubmit) always sent the real measuredState, so the preview and the
 *    results screen could disagree about the same meal;
 *  - scaling walked a hand-maintained list of 24 nutrient names, so any nutrient the API added later
 *    silently kept its per-100 g value while every sibling was scaled.
 *
 * Sending the real values costs one request per weight change, debounced, and removes all three.
 */
export function useLiveNutrition(ingredients: MealIngredient[]) {
  const [nutrition, setNutrition] = useState<NutritionalProfileResponse[] | null>(null)
  const [loading, setLoading] = useState(false)

  // The server owns the scaling now, so weight edits have to reach it: unlike the previous
  // per-100 g fetch, quantity and measuredState are part of the request and so of this key.
  const apiKey = ingredients
    .map((i) => `${i.id}:${i.cookingMethod}:${i.quantity}:${i.unit}:${i.measuredState}`)
    .join('|')

  useEffect(() => {
    if (ingredients.length === 0) {
      setNutrition(null)
      setLoading(false)
      return
    }
    let aborted = false
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const body = ingredients.map((i) => ({
          name: i.label,
          quantity: i.quantity,
          unit: i.unit,
          cookingMethod: i.cookingMethod,
          measuredState: i.measuredState,
          ingredientId: i.ingredientId,
        }))
        const res = await fetch('/api/nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!aborted && res.ok) {
          setNutrition(await res.json())
        }
      } catch {
        // best-effort preview — ignore network errors
      } finally {
        if (!aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => {
      aborted = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  return { nutrition, loading }
}
