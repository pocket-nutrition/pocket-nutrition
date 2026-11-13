import type {
  FeedbackRequest,
  FoodItemRequest,
  IngredientSuggestion,
  NutritionalProfileResponse,
} from '../types/api'

const BASE = '/api'

export interface SearchResponse {
  suggestions: IngredientSuggestion[]
  termCount: number
}

/**
 * `signal` is optional so existing callers are unaffected, but `useSearch` always passes one: without
 * it a superseded request still resolves and can overwrite a newer query's results.
 */
export async function searchIngredients(
  q: string,
  lang?: string,
  limit = 10,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q, limit: String(limit) })
  if (lang) params.set('lang', lang)
  const res = await fetch(`${BASE}/ingredients/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  const suggestions: IngredientSuggestion[] = await res.json()
  const termCount = parseInt(res.headers.get('X-Segment-Count') ?? '1', 10)
  return { suggestions, termCount }
}

export async function predictNutrition(
  items: FoodItemRequest[],
): Promise<NutritionalProfileResponse[]> {
  const res = await fetch(`${BASE}/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
  if (!res.ok) throw new Error(`Prediction failed: ${res.status}`)
  return res.json()
}

export async function postFeedback(req: FeedbackRequest): Promise<void> {
  const res = await fetch(`${BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Feedback failed: ${res.status}`)
}
