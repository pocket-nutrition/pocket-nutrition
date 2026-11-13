import { useState } from 'react'
import type { CookingMethod, MeasuredState, Unit, ServingUnit } from '../../types/api'
import { buildAnchors, describeQuantity, stepLabel } from '../../lib/units'
import { PortionScale } from './PortionScale'
import { FeedbackDialog } from '../feedback/FeedbackDialog'
import { getYieldFactor } from '../../lib/yieldFactor'
import { switchMeasuredState } from '../../lib/cookingTransforms'
import { useSwipe } from '../../hooks/useSwipe'

export interface MealIngredient {
  id: string
  label: string
  ingredientId: string
  cookingMethod: CookingMethod
  quantity: number
  unit: Unit
  measuredState: MeasuredState
  basePortionG: number
  portionFactor: number
  servingUnits: ServingUnit[]
  selectedUnit: ServingUnit | null
  unitCount: number
  displayUnit: 'g' | 'ml'
  canEatRaw: boolean | null
  yieldFactors: Record<string, number>
  imageUrl?: string | null
  servingMode?: 'item' | 'weight' | 'volume' | 'measure' | null
}

interface IngredientCardProps {
  ingredient: MealIngredient
  expanded: boolean
  onExpand: (open: boolean) => void
  onChange: (updated: MealIngredient) => void
  onRemove: () => void
  onHover?: (id: string | null) => void
  // Optional drag handle props — provided by DraggableCard in the grouped view
  dragListeners?: Record<string, (...args: unknown[]) => void>
  dragAttributes?: Record<string, unknown>
}

const COOKED_METHODS: { value: CookingMethod; label: string; emoji: string; hint?: string }[] = [
  { value: 'boiled', label: 'Boiled',  emoji: '🫧', hint: 'Water' },
  { value: 'steamed', label: 'Steamed',  emoji: '♨️', hint: 'Steamer basket' },
  { value: 'grilled', label: 'Grilled',  emoji: '🔥', hint: 'Pan / Barbecue' },
  { value: 'roasted', label: 'Roasted',    emoji: '🫕', hint: 'Oven' },
  { value: 'fried',   label: 'Fried',    emoji: '🍳', hint: 'Deep-fried' },
]

const ALL_METHODS: { value: CookingMethod; label: string; emoji: string; hint?: string }[] = [
  { value: 'raw', label: 'Raw', emoji: '🌿' },
  ...COOKED_METHODS,
]

const METHOD_ACTIVE_CLASS: Record<CookingMethod, string> = {
  raw:     'bg-emerald-500 border-emerald-500',
  boiled:  'bg-blue-500   border-blue-500',
  steamed: 'bg-teal-500   border-teal-500',
  grilled: 'bg-orange-500 border-orange-500',
  roasted: 'bg-amber-500  border-amber-500',
  fried:   'bg-yellow-500 border-yellow-500',
}

const METHOD_PILL_CLASS: Record<CookingMethod, string> = {
  raw:     'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  boiled:  'bg-blue-100   text-blue-700   hover:bg-blue-200',
  steamed: 'bg-teal-100   text-teal-700   hover:bg-teal-200',
  grilled: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  roasted: 'bg-amber-100  text-amber-700  hover:bg-amber-200',
  fried:   'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
}

function cookingLabel(method: CookingMethod): string {
  return COOKED_METHODS.find((m) => m.value === method)?.label ?? 'Cooked'
}

function cookingEmoji(method: CookingMethod): string {
  if (method === 'raw') return '🌿'
  return COOKED_METHODS.find((m) => m.value === method)?.emoji ?? '🔥'
}


function collapsedDescription(ingredient: MealIngredient): { quantity: string; grams: string } {
  // Same intelligent label as the picker tile: a named size / "≈ N portion" + exact grams,
  // so the collapsed row stays consistent even after a fine ± nudge or a typed value.
  const cooked = (factor: number): number => {
    const rawBase = ingredient.basePortionG * factor
    return (ingredient.cookingMethod === 'raw' || ingredient.measuredState === 'raw')
      ? Math.round(rawBase)
      : Math.round(rawBase * getYieldFactor(ingredient.yieldFactors, ingredient.cookingMethod))
  }
  const itemUnit = ingredient.servingUnits.find((u) => u.unit === 'item') ?? null
  const anchors = buildAnchors(ingredient.basePortionG, ingredient.servingUnits, ingredient.servingMode).map((s) => ({
    label: stepLabel(s),
    grams: s.kind === 'factor'
      ? cooked(s.factor)
      : Math.round((ingredient.displayUnit === 'ml' ? s.unit.volumeMl : s.unit.grams) * s.count),
  }))
  const { primary, secondary } = describeQuantity(ingredient.quantity, anchors, {
    servingMode: ingredient.servingMode,
    itemUnitG: ingredient.servingMode === 'item' && itemUnit ? itemUnit.grams : undefined,
    itemLabel: itemUnit?.labelFr,
    portionG: cooked(1.0),
    displayUnit: ingredient.displayUnit,
  })
  return { quantity: primary, grams: secondary }
}

export function IngredientCard({ ingredient, expanded, onExpand, onChange, onRemove, onHover, dragListeners, dragAttributes }: IngredientCardProps) {
  const [pickingMethod, setPickingMethod] = useState(false)
  const [reporting, setReporting] = useState(false)

  const { handlers, translateX, isRevealing, isExiting } = useSwipe(onRemove)

  const isRaw = ingredient.cookingMethod === 'raw'

  function set<K extends keyof MealIngredient>(key: K, value: MealIngredient[K]) {
    onChange({ ...ingredient, [key]: value })
  }

  function cookedQtyForMethod(method: CookingMethod, rawBase: number): number {
    return Math.round(rawBase * getYieldFactor(ingredient.yieldFactors, method))
  }

  function cookedQtyForFactor(factor: number): number {
    const rawBase = ingredient.basePortionG * factor
    return (isRaw || ingredient.measuredState === 'raw')
      ? Math.round(rawBase)
      : cookedQtyForMethod(ingredient.cookingMethod, rawBase)
  }

  function handleRawSelect() {
    let rawQty = ingredient.quantity
    if (!isRaw) {
      if (ingredient.portionFactor > 0) {
        rawQty = Math.round(ingredient.basePortionG * ingredient.portionFactor)
      } else if (ingredient.measuredState === 'cooked') {
        rawQty = Math.round(ingredient.quantity / getYieldFactor(ingredient.yieldFactors, ingredient.cookingMethod))
      }
    }
    onChange({ ...ingredient, cookingMethod: 'raw', measuredState: 'raw', quantity: rawQty })
  }

  function selectMethod(method: CookingMethod) {
    if (method === 'raw') {
      handleRawSelect()
      return
    }
    if (isRaw) {
      if (ingredient.portionFactor > 0) {
        const rawBase = ingredient.basePortionG * ingredient.portionFactor
        onChange({ ...ingredient, cookingMethod: method, measuredState: 'cooked', quantity: cookedQtyForMethod(method, rawBase) })
      } else {
        onChange({ ...ingredient, cookingMethod: method, measuredState: 'raw' })
      }
    } else if (ingredient.portionFactor > 0) {
      const rawBase = ingredient.basePortionG * ingredient.portionFactor
      onChange({ ...ingredient, cookingMethod: method, measuredState: 'cooked', quantity: cookedQtyForMethod(method, rawBase) })
    } else if (ingredient.measuredState === 'cooked') {
      const rawEquiv = ingredient.quantity / getYieldFactor(ingredient.yieldFactors, ingredient.cookingMethod)
      onChange({ ...ingredient, cookingMethod: method, quantity: Math.round(rawEquiv * getYieldFactor(ingredient.yieldFactors, method)) })
    } else {
      set('cookingMethod', method)
    }
  }

  function selectPortion(factor: number) {
    const rawBase = ingredient.basePortionG * factor
    const useRawWeight = isRaw || ingredient.measuredState === 'raw'
    const qty = useRawWeight ? rawBase : cookedQtyForMethod(ingredient.cookingMethod, rawBase)
    onChange({ ...ingredient, portionFactor: factor, quantity: Math.round(qty), selectedUnit: null })
  }

  // Delegates to lib/cookingTransforms rather than doing the arithmetic here. It used to be inline,
  // which meant the single most consequential weight conversion in the product was unreachable from a
  // test and invisible to the two native clients — `stepRawWeight` all over again. It also used
  // Math.round, which agrees with the corpus rule for positive weights but says so nowhere; the shared
  // function uses roundHalfUp explicitly, and the `switch-measured-state` suite pins the 42.5 tie that
  // tells the two apart.
  function changeMeasuredState(to: MeasuredState) {
    onChange(switchMeasuredState(ingredient, to))
  }

  // Writes an arbitrary weight (the picker's fine ± step, an increment, and the type-in value).
  function handleCustomQuantity(value: number) {
    onChange({ ...ingredient, quantity: Math.max(1, value), portionFactor: 0, selectedUnit: null })
  }

  // ── Collapsed row ──────────────────────────────────────────────
  if (!expanded) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className={`absolute inset-0 bg-rose-500 rounded-2xl flex items-center justify-end pr-5 transition-opacity ${
            isRevealing ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div
          {...handlers}
          onMouseEnter={() => onHover?.(ingredient.id)}
          onMouseLeave={() => onHover?.(null)}
          style={{
            transform: isExiting ? 'translateX(-100%)' : `translateX(${translateX}px)`,
            transition: translateX === 0 || isExiting ? 'transform 200ms ease' : undefined,
          }}
          className="relative bg-white border border-stone-200 rounded-2xl pl-3 pr-4 py-3 shadow-sm flex items-center gap-2 active:bg-stone-50 select-none"
        >
          {dragListeners && (
            <button
              {...dragListeners}
              {...dragAttributes}
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-stone-300 hover:text-stone-400 cursor-grab active:cursor-grabbing touch-none shrink-0"
              aria-label="Reorder"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="4" r="1.5" />
                <circle cx="11" cy="4" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="11" cy="12" r="1.5" />
              </svg>
            </button>
          )}
          {(() => {
            const { quantity, grams } = collapsedDescription(ingredient)
            return (
              <div
                onClick={() => onExpand(true)}
                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
              >
                {ingredient.imageUrl && (
                  <img
                    src={ingredient.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-md object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-stone-800 leading-snug truncate">
                    {ingredient.label}
                  </span>
                  {quantity && (
                    <span className="block text-xs text-stone-400 leading-none mt-0.5">
                      {quantity}
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400 font-normal whitespace-nowrap shrink-0">
                  {grams}
                </span>
                <svg className="w-4 h-4 text-stone-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  // ── Expanded card ──────────────────────────────────────────────
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm">
      {/* Header — name + merged cooking/weighed-state pill + remove + collapse buttons */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        {ingredient.imageUrl && (
          <img
            src={ingredient.imageUrl}
            alt=""
            className="w-9 h-9 rounded-md object-cover shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            loading="lazy"
          />
        )}
        <span className="text-sm font-semibold text-stone-800 flex-1 leading-snug truncate min-w-0">{ingredient.label}</span>
        <button
          onClick={() => setPickingMethod((prev) => !prev)}
          aria-label="Change cooking method and measured state"
          aria-expanded={pickingMethod}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${METHOD_PILL_CLASS[ingredient.cookingMethod]}`}
        >
          <span>{cookingEmoji(ingredient.cookingMethod)}</span>
          <span>{isRaw ? 'Raw' : cookingLabel(ingredient.cookingMethod)}</span>
          {!isRaw && (
            <span className="font-normal opacity-70">
              {' '}(weighed {ingredient.measuredState === 'cooked' ? 'after' : 'before'} cooking)
            </span>
          )}
          <svg
            className={`w-3 h-3 transition-transform ${pickingMethod ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={onRemove}
          aria-label="Remove ingredient"
          className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          onClick={() => { setPickingMethod(false); onExpand(false) }}
          aria-label="Collapse"
          className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Step 1 — cooking method + measured state, merged into the pill's panel.
          The state (which affects the weight) is set before the quantity. */}
      {pickingMethod ? (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-1.5">
            {ALL_METHODS.map((opt) => {
              const isActive = ingredient.cookingMethod === opt.value
              const isDisabled = opt.value === 'raw' && ingredient.canEatRaw === false
              return (
                <button
                  key={opt.value}
                  onClick={() => !isDisabled && selectMethod(opt.value)}
                  disabled={isDisabled}
                  title={isDisabled ? 'This ingredient is not eaten raw' : undefined}
                  className={`flex items-center gap-2 px-2.5 py-2.5 rounded-xl transition-colors border-2 ${
                    isDisabled
                      ? 'opacity-35 cursor-not-allowed bg-white text-stone-400 border-stone-100'
                      : isActive
                        ? `${METHOD_ACTIVE_CLASS[opt.value]} text-white`
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:text-stone-900'
                  }`}
                >
                  <span className="text-base shrink-0">{opt.emoji}</span>
                  <span className="flex flex-col items-start leading-tight min-w-0 text-left">
                    <span className="text-sm font-semibold">{opt.label}</span>
                    {opt.hint && <span className="text-[10px] font-normal opacity-70">{opt.hint}</span>}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Before / after weighing — only meaningful once a cooking method is set. Kept explicit
              because it materially changes the calculation and people genuinely switch between them;
              the default comes from the knowledge base, so it rarely needs a tap. */}
          {!isRaw && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500 shrink-0">Weighed:</span>
              <div role="group" aria-label="Weighed before or after cooking" className="flex gap-1 rounded-full bg-stone-100 p-0.5">
                {([
                  { state: 'raw', label: 'Before cooking', emoji: '🌿', activeCls: 'bg-emerald-500 text-white shadow-sm' },
                  { state: 'cooked', label: 'After cooking', emoji: '🍽️', activeCls: 'bg-orange-500 text-white shadow-sm' },
                ] as { state: MeasuredState; label: string; emoji: string; activeCls: string }[]).map((opt) => {
                  const active = ingredient.measuredState === opt.state
                  return (
                    <button
                      key={opt.state}
                      type="button"
                      onClick={() => changeMeasuredState(opt.state)}
                      aria-pressed={active}
                      className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        active ? opt.activeCls : 'text-stone-500 hover:text-stone-700'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Steps 2 & 3 — exact entry (text field + ±5) then hybrid shortcuts */}
          <PortionScale
            servingUnits={ingredient.servingUnits}
            displayUnit={ingredient.displayUnit}
            currentQuantity={ingredient.quantity}
            cookedQtyForFactor={cookedQtyForFactor}
            onSelectFactor={selectPortion}
            onAdjustWeight={handleCustomQuantity}
          />

          {/* Card footer — discreet report link into Knowledge (delete lives in the header) */}
          <div className="flex items-center px-4 pb-3 pt-1">
            <button
              type="button"
              onClick={() => setReporting(true)}
              aria-label="Report an inaccuracy"
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              Report
            </button>
          </div>
        </>
      )}

      {reporting && (
        <FeedbackDialog
          name={ingredient.label}
          ingredient={ingredient}
          onClose={() => setReporting(false)}
        />
      )}
    </div>
  )
}
