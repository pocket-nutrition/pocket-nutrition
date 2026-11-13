import { useEffect, useState } from 'react'
import type { NutritionRequest, NutritionResponse } from '../types'

// Same-origin proxy to the API, like the calculator's (nginx.conf in production, the dev proxy
// in docusaurus.config.js locally), so the page needs no CORS allowance from the API.
const API_URL = '/api/nutrition'

interface ApiState {
  data: NutritionResponse[] | null
  loading: boolean
  error: string | null
}

export function useNutritionApi(request: NutritionRequest[]): ApiState {
  const [state, setState] = useState<ApiState>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json() as Promise<NutritionResponse[]>
      })
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          setState({ data: null, loading: false, error: message })
        }
      })

    return () => {
      cancelled = true
    }
    // request is stable (defined at module level per example), safe to omit
  }, [])

  return state
}
