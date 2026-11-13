import { useState, useRef, useEffect } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { unpackRecipe, type AddItem } from '../../lib/addItems'
import { foodGroupIcon, shouldToggleSelection } from '../../lib/suggestions'
import type { IngredientSuggestion } from '../../types/api'

interface FoodSearchProps {
  onAdd: (items: AddItem[]) => void
  existingIngredientIds?: Set<string>
}

// Rows shown before the first "Show more", and how many more each click reveals.
const INITIAL_VISIBLE = 6
const SHOW_MORE_STEP = 6

interface ResultThumbnailProps {
  imageUrl?: string | null
  foodGroup?: string | null
}

/**
 * 56px thumbnail, always filled, so every row keeps an aligned slot.
 *
 * The fallback is now the food-group glyph rather than a neutral cutlery outline, and that ordering
 * matters: Open Food Facts supplies a photo for roughly four fifths of its products while the knowledge
 * base has no image field at all. A row drawing only `imageUrl` therefore gave every packaged product a
 * photograph and every curated ingredient the same grey placeholder — which made the industrial result
 * look more authoritative than the reference one, the opposite of the point.
 *
 * The outline stays as the last resort, for the three food groups deliberately left unmapped (`sauce`,
 * `seaweed`, `other`) and for a photo that fails to load. `other` is what the server assigns every
 * product and every recipe, so that branch is well travelled.
 */
function ResultThumbnail({ imageUrl, foodGroup }: ResultThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const icon = foodGroupIcon(foodGroup)

  if (!imageUrl || failed) {
    return (
      <span className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
        {icon ? (
          <span className="text-2xl" aria-hidden="true">{icon}</span>
        ) : (
          <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3v18M7 3v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M9 11v10M17 3c-1.66 0-3 2.24-3 5s1.34 5 3 5m0 0v8" />
          </svg>
        )}
      </span>
    )
  }

  return (
    <img
      src={imageUrl}
      alt=""
      className="w-14 h-14 rounded-lg object-cover shrink-0"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}

export function FoodSearch({ onAdd, existingIngredientIds = new Set() }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const { suggestions, termCount, loading, error } = useSearch(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setOpen(query.trim().length > 0)
    setSelectedIds(new Set())
    setVisibleCount(INITIAL_VISIBLE)
  }, [query])

  function closeAndRefocus() {
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleToggle(s: IngredientSuggestion) {
    // The branch order was inline arithmetic here until the predicate moved to lib/suggestions, where a
    // test and the two native clients can reach it. Recipes still short-circuit first because they need
    // unpackRecipe rather than a plain add — `shouldToggleSelection` says whether to toggle, not how to
    // add — but the *decision* is now the shared one.
    if (!shouldToggleSelection(termCount, s.productType)) {
      if (s.productType === 'recipe') {
        onAdd(unpackRecipe(s))
        setSelectedIds(new Set())
      } else {
        onAdd([{ suggestion: s }])
      }
      closeAndRefocus()
      return
    }
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(s.ingredientId)) next.delete(s.ingredientId)
      else next.add(s.ingredientId)
      return next
    })
  }

  function handleConfirm() {
    const selected = suggestions.filter(s => selectedIds.has(s.ingredientId))
    if (selected.length > 0) onAdd(selected.map(s => ({ suggestion: s })))
    setSelectedIds(new Set())
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleCancel() {
    setSelectedIds(new Set())
    setOpen(false)
    setQuery('')
    inputRef.current?.focus()
  }

  function handleBlur(e: React.FocusEvent) {
    if (!listRef.current?.contains(e.relatedTarget as Node)) {
      if (selectedIds.size > 0) return
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 bg-white border rounded-2xl px-4 py-3 shadow-sm transition-all ${
        selectedIds.size > 0
          ? 'border-indigo-300 ring-2 ring-indigo-200'
          : 'border-stone-200 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400'
      }`}>
        <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          readOnly={selectedIds.size > 0}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim().length > 0) setOpen(true) }}
          onBlur={handleBlur}
          placeholder="Add one or more ingredients… (rice chicken apple)"
          className={`flex-1 bg-transparent text-base outline-none transition-opacity ${
            selectedIds.size > 0
              ? 'text-stone-400 placeholder-stone-300 cursor-default select-none opacity-60'
              : 'text-stone-800 placeholder-stone-400'
          }`}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {loading && (
          <svg className="w-4 h-4 text-indigo-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 left-1/2 -translate-x-1/2 min-w-full w-[min(34rem,calc(100vw-2rem))] bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden max-h-80 overflow-y-auto"
        >
          {error && (
            <li className="px-4 py-3 text-sm text-rose-500">{error}</li>
          )}
          {!error && suggestions.length === 0 && !loading && (
            <li className="px-4 py-3 text-sm text-stone-400">No results</li>
          )}
          {suggestions.slice(0, visibleCount).map((s) => {
            const checked = selectedIds.has(s.ingredientId)
            const isMulti = termCount > 1
            if (s.productType === 'recipe') {
              const components = s.recipeComponents ?? []
              return (
                <li key={s.ingredientId}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleToggle(s)}
                    className="w-full text-left px-4 py-3 transition-colors flex items-center gap-3 group bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 active:from-indigo-100 active:to-violet-100 border-l-4 border-indigo-500"
                  >
                    <span className="w-14 h-14 rounded-lg bg-white border border-indigo-100 flex items-center justify-center shrink-0 text-2xl shadow-sm">
                      🍲
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-indigo-900 truncate">
                        Recipe: {s.label}
                      </span>
                      <span className="block text-xs text-indigo-600/80 truncate">
                        {components.map((c) => c.ingredient.label).join(', ')}
                      </span>
                    </span>
                    <span className="text-[10px] text-indigo-700 bg-white border border-indigo-200 rounded px-1.5 py-0.5 shrink-0 font-medium">
                      {components.length} ingredients
                    </span>
                  </button>
                </li>
              )
            }
            return (
              <li key={s.ingredientId}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleToggle(s)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 group ${
                    checked ? 'bg-indigo-50' : 'hover:bg-stone-50 active:bg-stone-100'
                  }`}
                >
                  {isMulti && (
                    <span
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-stone-300 group-hover:border-indigo-400'
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
                        </svg>
                      )}
                    </span>
                  )}
                  <ResultThumbnail imageUrl={s.imageUrl} foodGroup={s.foodGroup} />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium truncate ${checked ? 'text-indigo-700' : 'text-stone-800 group-hover:text-stone-900'}`}>
                      {s.label}
                    </span>
                    {/* The brand is what tells two products sharing a name apart, and the reason the
                        deduplication key now includes it. Curated ingredients have none, so the line
                        simply does not render for them. */}
                    {s.brand && (
                      <span className="block text-xs text-stone-500 truncate">{s.brand}</span>
                    )}
                  </span>
                  {existingIngredientIds.has(s.ingredientId) && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 shrink-0 font-medium">
                      Already added
                    </span>
                  )}
                  {s.productType === 'off_product' && (
                    <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5 shrink-0 font-medium">
                      Product
                    </span>
                  )}
                  {s.productType !== 'off_product' && (
                    <span className={`text-[10px] rounded px-1.5 py-0.5 shrink-0 font-medium uppercase tracking-wide border ${
                      s.lang === 'fr'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-stone-400 bg-stone-50 border-stone-200'
                    }`}>{s.lang}</span>
                  )}
                </button>
              </li>
            )
          })}
          {suggestions.length > visibleCount && (
            <li>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setVisibleCount((c) => c + SHOW_MORE_STEP)}
                className="w-full px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-1"
              >
                Show more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </li>
          )}
          {selectedIds.size > 0 && (
            <li className="sticky bottom-0 border-t border-stone-100 bg-white px-3 py-2.5 flex gap-2">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCancel}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-50 active:bg-stone-100 transition-colors shrink-0"
              >
                Cancel
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
              >
                Add ({selectedIds.size})
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
