import { useEffect, useId, useRef, useState } from 'react'
import type { MealIngredient } from '../ingredient-card/IngredientCard'
import type { FeedbackCorrection, NutritionalProfileResponse } from '../../types/api'
import { postFeedback } from '../../lib/api'
import { FEEDBACK_CATEGORIES, type CorrectionError, type CurrentValueHint } from '../../lib/feedbackCatalog'

interface FeedbackDialogProps {
  name: string
  ingredient: MealIngredient | null
  // Present in the results context; absent when reporting from the entry card.
  result?: NutritionalProfileResponse | null
  onClose: () => void
}

// Show the current known value next to an error, when the client has it.
function currentValue(
  hint: CurrentValueHint | undefined,
  ingredient: MealIngredient | null,
  result: NutritionalProfileResponse | null,
): string | null {
  if (!hint) return null
  switch (hint) {
    case 'reference_weight':
      return ingredient ? `${Math.round(ingredient.basePortionG)} g` : null
    case 'display_unit':
      return ingredient?.displayUnit ?? null
    case 'serving_units':
      if (!ingredient) return null
      return ingredient.servingUnits.length
        ? ingredient.servingUnits.map((u) => u.labelFr).join(', ')
        : 'none'
    case 'raw_cooked':
      if (!ingredient || ingredient.canEatRaw == null) return null
      return ingredient.canEatRaw ? 'can be eaten raw' : 'cooking required'
    case 'cooking_method':
      return result?.cookingMethod ?? ingredient?.cookingMethod ?? null
    default:
      return null
  }
}

export function FeedbackDialog({ name, ingredient, result, onClose }: FeedbackDialogProps) {
  const uid = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ category: string; error: CorrectionError } | null>(null)
  const [draftValue, setDraftValue] = useState('')
  const [draftUnit, setDraftUnit] = useState('')
  const [corrections, setCorrections] = useState<FeedbackCorrection[]>([])
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  // Move focus into the dialog on open and trap Tab within it (WCAG 2.4.3 / 2.1.2).
  useEffect(() => {
    const node = dialogRef.current
    node?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const clearError = () => {
    if (status === 'error') setStatus('idle')
  }

  const selectError = (category: string, error: CorrectionError) => {
    setDraft({ category, error })
    const input = error.input
    if (input.kind === 'select') {
      setDraftValue(input.options[0]?.value ?? '')
      setDraftUnit('')
    } else if (input.kind === 'number-unit') {
      setDraftValue('')
      setDraftUnit(input.units[0])
    } else {
      setDraftValue('')
      setDraftUnit('')
    }
  }

  const addCorrection = () => {
    if (!draft) return
    const value = draftValue.trim()
    if (!value) return
    const c: FeedbackCorrection = {
      category: draft.category,
      code: draft.error.code,
      value,
      ...(draft.error.input.kind === 'number-unit' ? { unit: draftUnit } : {}),
    }
    setCorrections((prev) => [...prev, c])
    setDraft(null)
    setDraftValue('')
    clearError()
  }

  const removeCorrection = (i: number) => {
    setCorrections((prev) => prev.filter((_, idx) => idx !== i))
    clearError()
  }

  const canSend = (corrections.length > 0 || comment.trim().length > 0) && status !== 'sending' && status !== 'done'

  const submit = async () => {
    if (!canSend) return
    setStatus('sending')
    try {
      await postFeedback({
        name,
        corrections,
        comment: comment.trim() || undefined,
        cookingMethod: result?.cookingMethod ?? ingredient?.cookingMethod,
        measuredState: result?.measuredState ?? ingredient?.measuredState,
        // Omitted when there is no result, like the two fields above. 'entry' used to be sent here,
        // but it is not a member of the server's source union (cache | ml | off_direct | unavailable)
        // — a client-minted enum value is worse than an absent optional field.
        source: result?.source,
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const categoryLabel = (code: string) => FEEDBACK_CATEGORIES.find((c) => c.code === code)?.label ?? code
  const errorLabel = (catCode: string, code: string) =>
    FEEDBACK_CATEGORIES.find((c) => c.code === catCode)?.errors.find((e) => e.code === code)?.label ?? code

  const subtitle = result
    ? `${Math.round(result.confidence * 100)}% · ${result.source} · ${result.cookingMethod} · weighed ${
        result.measuredState === 'raw' ? 'raw' : 'cooked'
      }`
    : ingredient
      ? `${ingredient.cookingMethod} · weighed ${ingredient.measuredState === 'raw' ? 'raw' : 'cooked'}`
      : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        tabIndex={-1}
        className="bg-white w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 flex flex-col gap-4 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={`${uid}-title`} className="text-base font-semibold text-stone-800">
              {name}
            </h2>
            {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-stone-400 hover:text-stone-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Current known values */}
        <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-600 grid grid-cols-2 gap-y-1 gap-x-3">
          {ingredient && (
            <>
              <span className="text-stone-400">Reference weight</span>
              <span>{Math.round(ingredient.basePortionG)} g</span>
              <span className="text-stone-400">Display unit</span>
              <span>{ingredient.displayUnit}</span>
              <span className="text-stone-400">Units</span>
              <span>
                {ingredient.servingUnits.length
                  ? ingredient.servingUnits.map((u) => u.labelFr).join(', ')
                  : 'none'}
              </span>
            </>
          )}
          {result?.available && (
            <>
              <span className="text-stone-400">Energy</span>
              <span>{Math.round(result.energyKcal)} kcal</span>
            </>
          )}
        </div>

        {status === 'done' ? (
          <p className="text-sm text-emerald-600">Thanks, your report has been sent to the team.</p>
        ) : (
          <>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-stone-700">Report an inaccuracy</p>
              <p className="text-xs text-stone-400">Choose a category, then the specific issue.</p>
            </div>

            {/* Corrections already added */}
            {corrections.length > 0 && (
              <div className="flex flex-col gap-1">
                {corrections.map((c, i) => (
                  <div
                    key={`${c.category}-${c.code}-${i}`}
                    className="flex items-center justify-between gap-2 text-xs bg-rose-50 text-rose-700 rounded-lg px-2 py-1"
                  >
                    <span>
                      {categoryLabel(c.category)} › {errorLabel(c.category, c.code)}
                      {c.value ? ` : ${c.value}${c.unit ? ' ' + c.unit : ''}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCorrection(i)}
                      aria-label="Remove this correction"
                      className="shrink-0 hover:text-rose-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Category accordion → specific errors → typed value */}
            <div className="flex flex-col gap-1.5">
              {FEEDBACK_CATEGORIES.map((cat) => {
                const open = openCategory === cat.code
                const regionId = `${uid}-cat-${cat.code}`
                return (
                  <div key={cat.code} className="border border-stone-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenCategory(open ? null : cat.code)
                        setDraft(null)
                      }}
                      aria-expanded={open}
                      aria-controls={regionId}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <span>{cat.label}</span>
                      <span className="text-stone-400">{open ? '−' : '+'}</span>
                    </button>
                    {open && (
                      <div id={regionId} className="px-3 py-2 flex flex-col gap-1.5 border-t border-stone-100">
                        {cat.errors.map((err) => {
                          const cur = currentValue(err.hint, ingredient, result ?? null)
                          const active = draft?.category === cat.code && draft?.error.code === err.code
                          return (
                            <div key={err.code} className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => selectError(cat.code, err)}
                                className={`text-left text-xs px-2 py-1.5 rounded-lg ${
                                  active ? 'bg-indigo-50 text-indigo-700' : 'text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                {err.label}
                                {cur && <span className="text-stone-400"> · current: {cur}</span>}
                              </button>
                              {active && (
                                <div className="flex items-center gap-2 pl-2">
                                  <DraftInput
                                    error={err}
                                    value={draftValue}
                                    unit={draftUnit}
                                    onValue={setDraftValue}
                                    onUnit={setDraftUnit}
                                  />
                                  <button
                                    type="button"
                                    onClick={addCorrection}
                                    disabled={!draftValue.trim()}
                                    className="shrink-0 text-xs px-2 py-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                                  >
                                    Add
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1">
              <label htmlFor={`${uid}-comment`} className="text-xs font-medium text-stone-500">
                Comment (optional)
              </label>
              <textarea
                id={`${uid}-comment`}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                  clearError()
                }}
                maxLength={2000}
                rows={2}
                className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-500" role="alert">
                Could not send right now. Please try again later.
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-rose-500 text-white font-medium disabled:opacity-50 hover:bg-rose-600 transition-colors"
              >
                {status === 'sending' ? 'Sending…' : 'Send report'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DraftInput({
  error,
  value,
  unit,
  onValue,
  onUnit,
}: {
  error: CorrectionError
  value: string
  unit: string
  onValue: (v: string) => void
  onUnit: (u: string) => void
}) {
  const input = error.input
  if (input.kind === 'select') {
    return (
      <select
        aria-label={error.label}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        className="flex-1 text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
      >
        {input.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }
  if (input.kind === 'number-unit') {
    return (
      <>
        <input
          aria-label={error.label}
          type="number"
          min={0}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          className="flex-1 min-w-0 text-xs border border-stone-200 rounded-lg px-2 py-1.5"
        />
        <select
          aria-label="unit"
          value={unit}
          onChange={(e) => onUnit(e.target.value)}
          className="shrink-0 text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
        >
          {input.units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </>
    )
  }
  if (input.kind === 'number') {
    return (
      <div className="flex-1 flex items-center gap-1">
        <input
          aria-label={error.label}
          type="number"
          min={0}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          className="flex-1 min-w-0 text-xs border border-stone-200 rounded-lg px-2 py-1.5"
        />
        {input.suffix && <span className="text-xs text-stone-400">{input.suffix}</span>}
      </div>
    )
  }
  return (
    <input
      aria-label={error.label}
      type="text"
      value={value}
      onChange={(e) => onValue(e.target.value)}
      placeholder={input.placeholder}
      className="flex-1 min-w-0 text-xs border border-stone-200 rounded-lg px-2 py-1.5"
    />
  )
}
