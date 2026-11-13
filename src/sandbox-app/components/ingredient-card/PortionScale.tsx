import { useMemo, useState } from 'react'
import type { ServingUnit } from '../../types/api'
import { resolveShortcutProfile, type Shortcut } from '../../lib/shortcuts'
import { useHoldRepeat } from '../../hooks/useHoldRepeat'

export interface PortionScaleProps {
  servingUnits: ServingUnit[]
  displayUnit: 'g' | 'ml'
  // The true current weight the user sees (post-cooking-yield, in display units).
  currentQuantity: number
  cookedQtyForFactor: (factor: number) => number
  onSelectFactor: (factor: number) => void
  // Writes an arbitrary weight in grams/mL (the fine ±5 step and the type-in value).
  onAdjustWeight: (grams: number) => void
}

const STEP = 5
const MIN_G = 1
const MAX_G = 5000

export function PortionScale({
  servingUnits,
  displayUnit,
  currentQuantity,
  cookedQtyForFactor,
  onSelectFactor,
  onAdjustWeight,
}: PortionScaleProps) {
  const [editing, setEditing] = useState(false)
  const unitWord = displayUnit === 'ml' ? 'mL' : 'g'

  const shortcuts = useMemo(
    () => resolveShortcutProfile({ servingUnits, displayUnit }),
    [servingUnits, displayUnit],
  )

  function commitEdit(raw: string) {
    setEditing(false)
    const v = Math.round(Number(raw))
    if (Number.isFinite(v) && v >= MIN_G) onAdjustWeight(Math.min(MAX_G, Math.max(MIN_G, v)))
  }

  // ±5 micro-adjustments. Return false at the bound so press-and-hold stops.
  const dec = useHoldRepeat(() => {
    const next = Math.max(MIN_G, currentQuantity - STEP)
    if (next === currentQuantity) return false
    onAdjustWeight(next)
  })
  const inc = useHoldRepeat(() => {
    const next = Math.min(MAX_G, currentQuantity + STEP)
    if (next === currentQuantity) return false
    onAdjustWeight(next)
  })

  // Type A multipliers light up when the current weight matches the (yield-aware)
  // target; Type B increments are pure adders and never show an active state.
  function isFactorActive(factor: number): boolean {
    const target = cookedQtyForFactor(factor)
    const tol = Math.max(2, target * 0.04)
    return Math.abs(currentQuantity - target) <= tol
  }

  function applyShortcut(s: Shortcut) {
    setEditing(false)
    if (s.kind === 'multiplier') onSelectFactor(s.factor)
    else onAdjustWeight(Math.min(MAX_G, currentQuantity + s.grams))
  }

  // ≥44×44 touch target even though the glyph is small, so a near-miss tap never
  // lands on the field and pops the keyboard. touch-none keeps press-and-hold
  // from being hijacked by scroll/long-press gestures. Neutral grey feedback:
  // steppers are triggers, and indigo is reserved for selected state.
  const stepBtn =
    'w-12 min-h-[44px] shrink-0 rounded-2xl border-2 border-stone-200 bg-white text-2xl font-bold text-stone-600 flex items-center justify-center transition-colors touch-none hover:border-stone-300 hover:text-stone-900 active:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-600 select-none'

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">
      {/* Step 2 — Exact entry: plain text field (− 5 | value ✏️ | + 5) */}
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          {...dec}
          disabled={currentQuantity <= MIN_G}
          aria-label={`Subtract ${STEP} ${unitWord}`}
          className={stepBtn}
        >
          −
        </button>

        {editing ? (
          <div className="flex-1 flex items-center justify-center gap-1 rounded-2xl border-2 border-indigo-400 bg-white px-3 py-3 ring-2 ring-indigo-400">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              autoFocus
              defaultValue={Math.round(currentQuantity)}
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit(e.currentTarget.value)
                else if (e.key === 'Escape') setEditing(false)
              }}
              onBlur={(e) => commitEdit(e.currentTarget.value)}
              aria-label="Enter the exact quantity"
              className="w-24 bg-transparent text-center text-3xl font-bold text-stone-900 outline-none tabular-nums [appearance:textfield]"
            />
            <span className="text-lg font-semibold text-stone-400">{unitWord}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Quantity: ${Math.round(currentQuantity)} ${unitWord}. Tap to enter an exact value.`}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-stone-50 px-3 py-3 text-stone-900 transition-colors hover:border-indigo-300 cursor-text select-none"
          >
            <span className="text-3xl font-bold leading-tight tabular-nums">
              {Math.round(currentQuantity)}
            </span>
            <span className="text-lg font-semibold text-stone-400">{unitWord}</span>
            <svg aria-hidden="true" className="w-4 h-4 text-stone-400 ml-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        <button
          type="button"
          {...inc}
          disabled={currentQuantity >= MAX_G}
          aria-label={`Add ${STEP} ${unitWord}`}
          className={stepBtn}
        >
          +
        </button>
      </div>

      {/* Step 3 — Hybrid shortcuts: multipliers (base) + increments (Knowledge) */}
      <div role="list" aria-label="Portion shortcuts" className="flex gap-1.5">
        {shortcuts.map((s) => {
          const active = s.kind === 'multiplier' && isFactorActive(s.factor)
          const key = s.kind === 'multiplier' ? `m:${s.factor}` : `i:${s.label}`
          const ariaLabel =
            s.kind === 'multiplier'
              ? `Set the portion: ${s.label}`
              : `Add ${s.grams} ${unitWord} (${s.label})`
          // Visual grammar: indigo marks *state*, so only multipliers may wear it.
          // Increments are momentary triggers — neutral grey hover, a press flash,
          // and a keyboard-only focus ring — so nothing lingers after a tap that
          // could read as "selected".
          const stateCls = active
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : s.kind === 'multiplier'
              ? 'bg-white border-stone-200 text-stone-700 hover:border-indigo-300 hover:text-indigo-600'
              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:text-stone-900 active:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400'
          return (
            <button
              key={key}
              type="button"
              role="listitem"
              onClick={() => applyShortcut(s)}
              aria-pressed={s.kind === 'multiplier' ? active : undefined}
              aria-label={ariaLabel}
              className={`flex-1 min-w-0 min-h-[44px] flex items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-sm font-semibold transition-colors select-none ${stateCls}`}
            >
              {s.kind === 'increment' ? (
                <>
                  <span aria-hidden="true" className="font-bold text-stone-400">+</span>
                  {s.emoji && <span aria-hidden="true">{s.emoji}</span>}
                  <span className="truncate">{s.label}</span>
                </>
              ) : (
                <span className="truncate">{s.label}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
