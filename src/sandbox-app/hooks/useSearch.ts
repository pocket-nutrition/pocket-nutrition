import { useState, useEffect, useRef } from 'react'
import { searchIngredients } from '../lib/api'
import { deduplicateByLabel } from '../lib/suggestions'
import type { IngredientSuggestion } from '../types/api'

// Deduplication, language preference and the result cap moved to lib/suggestions.ts so the shared
// corpus can pin them: the rules are cross-client behaviour, and buried in this hook they were
// invisible to the native clients — both of which shipped without them and rendered duplicate rows.
// MIN_SAME_LANG and MAX_SUGGESTIONS live there too.

// Over-fetch, then let deduplicateByLabel decide how much of it is worth offering.
const OVER_FETCH = 30

interface UseSearchResult {
  suggestions: IngredientSuggestion[]
  termCount: number
  loading: boolean
  error: string | null
}

export function useSearch(query: string, debounceMs = 300): UseSearchResult {
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([])
  const [termCount, setTermCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim()) {
      setSuggestions([])
      setTermCount(1)
      setLoading(false)
      return
    }

    setLoading(true)
    // Drop the previous query's results *now*, not when the new ones land.
    //
    // Without this the field can read "poulet" while the list still offers "Poule" — hen, 252 g, an
    // Open Food Facts product — because those rows answer a query the user has already moved on from.
    // Not a latency problem: the API answers in ~70 ms. `setSuggestions` only ran on success, so every
    // in-flight moment rendered stale food with nothing marking it stale. For a nutrition tool that is
    // the dangerous failure shape: not blank, not an error, just confidently the wrong ingredient.
    //
    // Found on the iOS client and fixed there and on Android first; this is the same bug in the
    // reference implementation.
    setSuggestions([])

    // An AbortController, because clearTimeout alone is not enough. It cancels a *pending* request; a
    // request that has already started is untouched, so its `setSuggestions` can resolve AFTER a newer
    // query's and overwrite good data with old. Both mobile clients were always immune — they cancel
    // the in-flight task (Task.cancel / LaunchedEffect cancellation) — and this closes the same hole
    // here. The guard is a real ordering fix, not defensive noise: it is reachable any time two
    // requests overlap, which is any time the user types faster than the network answers.
    const controller = new AbortController()

    timerRef.current = setTimeout(async () => {
      try {
        const lang = navigator.language.split('-')[0]
        const { suggestions: raw, termCount: count } = await searchIngredients(
          query.trim(), lang, OVER_FETCH, controller.signal,
        )
        setSuggestions(deduplicateByLabel(raw, lang))
        setTermCount(count)
        setError(null)
      } catch (err) {
        // An abort is control flow, not failure — the same distinction the Kotlin client makes by
        // rethrowing CancellationException instead of showing it. Reporting it would put "The user
        // aborted a request" on screen every time someone types a second character.
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Search failed')
        setSuggestions([])
        setTermCount(1)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      controller.abort()
    }
  }, [query, debounceMs])

  return { suggestions, termCount, loading, error }
}
