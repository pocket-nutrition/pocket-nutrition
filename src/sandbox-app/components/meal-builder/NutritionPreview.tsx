import type { MealIngredient } from '../ingredient-card/IngredientCard'
import type { NutritionalProfileResponse } from '../../types/api'

const INGREDIENT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#f97316', '#0ea5e9', '#ec4899',
]

interface NutrientRow {
  key: keyof NutritionalProfileResponse
  label: string
  unit: string
}

const NUTRIENT_ROWS: NutrientRow[] = [
  { key: 'energyKcal',      label: 'Energy',        unit: 'kcal' },
  { key: 'proteinG',        label: 'Protein',       unit: 'g'    },
  { key: 'carbohydratesG',  label: 'Carbohydrates', unit: 'g'    },
  { key: 'fatG',            label: 'Fat',           unit: 'g'    },
  { key: 'fiberG',          label: 'Fiber',         unit: 'g'    },
]

interface NutritionPreviewProps {
  ingredients: MealIngredient[]
  nutrition: NutritionalProfileResponse[] | null
  loading: boolean
  hoveredId: string | null
}

export function NutritionPreview({ ingredients, nutrition, loading, hoveredId }: NutritionPreviewProps) {
  if (ingredients.length === 0) return null

  const hasData = nutrition && nutrition.length > 0

  return (
    <div className="mt-2 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nutrition preview</p>
        {loading && (
          <svg className="w-3.5 h-3.5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
      </div>

      {!hasData ? (
        <div className="space-y-2.5">
          {NUTRIENT_ROWS.map((row) => (
            <div key={row.key} className="flex items-center gap-2">
              <span className="w-24 text-xs text-stone-400 shrink-0">{row.label}</span>
              <div className="flex-1 h-3 bg-stone-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            {NUTRIENT_ROWS.map((row) => {
              const values = nutrition.map((n) => {
                const v = n[row.key]
                return typeof v === 'number' ? v : 0
              })
              const total = values.reduce((a, b) => a + b, 0)
              if (row.key === 'fiberG' && total === 0) return null

              return (
                <div key={row.key} className="flex items-center gap-2">
                  <span className="w-24 text-xs text-stone-500 shrink-0">{row.label}</span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden bg-stone-100 flex">
                    {nutrition.map((n, idx) => {
                      const v = typeof n[row.key] === 'number' ? (n[row.key] as number) : 0
                      if (v <= 0 || total === 0) return null
                      const pct = (v / total) * 100
                      const color = INGREDIENT_COLORS[idx % INGREDIENT_COLORS.length]
                      const ing = ingredients[idx]
                      const dimmed = hoveredId !== null && ing && hoveredId !== ing.id
                      return (
                        <div
                          key={idx}
                          style={{
                            width: `${pct}%`,
                            backgroundColor: color,
                            opacity: dimmed ? 0.15 : 1,
                            transition: 'opacity 150ms',
                          }}
                        />
                      )
                    })}
                  </div>
                  <span className="w-14 text-right text-xs font-semibold text-stone-600 tabular-nums shrink-0">
                    {total % 1 === 0 ? total : total.toFixed(1)} {row.unit}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {ingredients.map((ing, idx) => {
              const color = INGREDIENT_COLORS[idx % INGREDIENT_COLORS.length]
              const dimmed = hoveredId !== null && hoveredId !== ing.id
              return (
                <div
                  key={ing.id}
                  className="flex items-center gap-1.5"
                  style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 150ms' }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-stone-500 truncate max-w-24">{ing.label}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
