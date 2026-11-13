import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { IngredientCard, type MealIngredient } from '../ingredient-card/IngredientCard'

interface DraggableCardProps {
  ingredient: MealIngredient
  expanded: boolean
  onExpand: (open: boolean) => void
  onChange: (updated: MealIngredient) => void
  onRemove: () => void
  onHover: (id: string | null) => void
}

export function DraggableCard({ ingredient, expanded, onExpand, onChange, onRemove, onHover }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
    disabled: expanded,
  })

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : undefined }
          : undefined
      }
    >
      <IngredientCard
        ingredient={ingredient}
        expanded={expanded}
        onExpand={onExpand}
        onChange={onChange}
        onRemove={onRemove}
        onHover={onHover}
        dragListeners={!expanded && listeners ? (listeners as Record<string, (...args: unknown[]) => void>) : undefined}
        dragAttributes={!expanded ? (attributes as unknown as Record<string, unknown>) : undefined}
      />
    </div>
  )
}
