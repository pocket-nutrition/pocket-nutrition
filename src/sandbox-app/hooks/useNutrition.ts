import { useState, useCallback } from 'react'
import { predictNutrition } from '../lib/api'
import type { FoodItemRequest, NutritionalProfileResponse } from '../types/api'

interface UseNutritionResult {
  results: NutritionalProfileResponse[] | null
  loading: boolean
  error: string | null
  predict: (items: FoodItemRequest[]) => Promise<void>
  reset: () => void
}

export function useNutrition(): UseNutritionResult {
  const [results, setResults] = useState<NutritionalProfileResponse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (items: FoodItemRequest[]) => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictNutrition(items)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return { results, loading, error, predict, reset }
}
