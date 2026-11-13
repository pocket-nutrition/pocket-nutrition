import { useDroppable } from '@dnd-kit/core'
import type { CookingMeta } from '../../lib/cookingMeta'
import type { MealIngredient } from '../ingredient-card/IngredientCard'
import { DraggableCard } from './DraggableCard'

interface CookingLaneProps {
  meta: CookingMeta
  ingredients: MealIngredient[]
  expandedId: string | null
  onExpand: (id: string | null) => void
  onChange: (id: string, updated: MealIngredient) => void
  onRemove: (id: string) => void
  onHover: (id: string | null) => void
}

export function CookingLane({ meta, ingredients, expandedId, onExpand, onChange, onRemove, onHover }: CookingLaneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: meta.method })

  return (
    <div>
      <div className="flex items-center gap-2 px-1 mb-2">
        <span className="text-base leading-none">{meta.emoji}</span>
        <span className={`text-sm font-semibold ${meta.headerText}`}>{meta.label}</span>
        {ingredients.length > 0 && (
          <span className="text-xs text-stone-400">· {ingredients.length}</span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-12 rounded-2xl p-1 transition-all ${
          isOver
            ? `${meta.dropBg} ring-2 ${meta.dropRing}`
            : ingredients.length === 0
              ? 'border border-dashed border-stone-200'
              : ''
        }`}
      >
        {ingredients.length === 0 && !isOver && (
          <p className="text-center text-xs text-stone-300 py-3">Drop here</p>
        )}
        {ingredients.map((ing) => (
          <DraggableCard
            key={ing.id}
            ingredient={ing}
            expanded={expandedId === ing.id}
            onExpand={(open) => onExpand(open ? ing.id : null)}
            onChange={(updated) => onChange(ing.id, updated)}
            onRemove={() => onRemove(ing.id)}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  )
}
