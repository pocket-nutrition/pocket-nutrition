import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import type { MealIngredient } from '../ingredient-card/IngredientCard'
import { FoodSearch } from '../food-search/FoodSearch'
import { buildMealIngredient, type AddItem } from '../../lib/addItems'
import { COOKING_META } from '../../lib/cookingMeta'
import { applyMethodChange } from '../../lib/cookingTransforms'
import { CookingLane } from './CookingLane'
import { NutritionPreview } from './NutritionPreview'
import { useLiveNutrition } from '../../hooks/useLiveNutrition'
import type { CookingMethod } from '../../types/api'

interface MealBuilderProps {
  ingredients: MealIngredient[]
  onChange: (ingredients: MealIngredient[]) => void
  onSubmit: () => void
  loading: boolean
}

export function MealBuilder({ ingredients, onChange, onSubmit, loading }: MealBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [skippedCount, setSkippedCount] = useState(0)
  const { nutrition, loading: nutritionLoading } = useLiveNutrition(ingredients)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
  )

  function addIngredients(items: AddItem[]) {
    // buildMealIngredient returns null when the API supplied no portion weight or no eating state
    // for a suggestion. The viewer holds no food data of its own, so there is nothing to substitute:
    // the row is skipped and the gap is shown, rather than rendered with an invented weight.
    const built = items.map((item, i) => buildMealIngredient(item, i))
    const newItems = built.filter((i): i is MealIngredient => i !== null)
    setSkippedCount(built.length - newItems.length)
    if (newItems.length > 0) onChange([...ingredients, ...newItems])
  }

  function updateIngredient(id: string, updated: MealIngredient) {
    onChange(ingredients.map((i) => (i.id === id ? updated : i)))
  }

  function removeIngredient(id: string) {
    onChange(ingredients.filter((i) => i.id !== id))
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
    setExpandedId(null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const ing = ingredients.find((i) => i.id === active.id)
    if (!ing) return
    const newMethod = over.id as CookingMethod
    if (newMethod === ing.cookingMethod) return
    onChange(ingredients.map((i) => (i.id === ing.id ? applyMethodChange(i, newMethod) : i)))
  }

  const grouped = Object.fromEntries(
    COOKING_META.map((m) => [m.method, ingredients.filter((i) => i.cookingMethod === m.method)]),
  )
  const isDragging = activeId !== null
  const activeIngredient = activeId ? ingredients.find((i) => i.id === activeId) : null

  // During drag, show all lanes as drop targets; otherwise only populated ones.
  const visibleMeta = isDragging
    ? COOKING_META
    : COOKING_META.filter((m) => (grouped[m.method]?.length ?? 0) > 0)

  return (
    <div className="flex flex-col gap-4">
      <FoodSearch onAdd={addIngredients} existingIngredientIds={new Set(ingredients.map(i => i.ingredientId))} />

      {skippedCount > 0 && (
        <div
          role="status"
          className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2"
        >
          <span className="shrink-0 mt-0.5">▸</span>
          <span>
            {skippedCount === 1 ? '1 ingredient could not be added' : `${skippedCount} ingredients could not be added`}
            {' '}: the API returned neither a reference portion (<code>servingG</code>) nor a usable eating
            state (<code>typicalState</code>, <code>portionMeasuredState</code>). This gap gets fixed
            in Knowledge — the tool never invents a weight.
          </span>
          <button
            type="button"
            onClick={() => setSkippedCount(0)}
            className="ml-auto shrink-0 text-amber-600 hover:text-amber-800"
            aria-label="Dismiss warning"
          >
            ✕
          </button>
        </div>
      )}

      {ingredients.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <div className="text-4xl mb-3">🥗</div>
          <p className="text-sm">Search for an ingredient above to get started</p>
        </div>
      ) : (
        <>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-5">
              {visibleMeta.map((meta) => (
                <CookingLane
                  key={meta.method}
                  meta={meta}
                  ingredients={grouped[meta.method] ?? []}
                  expandedId={expandedId}
                  onExpand={setExpandedId}
                  onChange={updateIngredient}
                  onRemove={removeIngredient}
                  onHover={setHoveredId}
                />
              ))}
            </div>

            <DragOverlay>
              {activeIngredient && (
                <div className="bg-white border border-stone-200 rounded-2xl pl-3 pr-4 py-3 shadow-lg flex items-center gap-2 opacity-95">
                  <svg className="w-4 h-4 text-stone-300 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="4" r="1.5" />
                    <circle cx="11" cy="4" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="11" cy="12" r="1.5" />
                  </svg>
                  <span className="flex-1 text-sm font-semibold text-stone-800 leading-snug">
                    {activeIngredient.label}
                  </span>
                  <span className="text-xs text-stone-500 whitespace-nowrap font-medium">
                    {activeIngredient.quantity}g
                  </span>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          <NutritionPreview
            ingredients={ingredients}
            nutrition={nutrition}
            loading={nutritionLoading}
            hoveredId={hoveredId}
          />

          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing…
              </>
            ) : (
              `Generate report (${ingredients.length} ingredient${ingredients.length > 1 ? 's' : ''})`
            )}
          </button>
        </>
      )}
    </div>
  )
}
