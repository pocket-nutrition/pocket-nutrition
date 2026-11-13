import { useState } from 'react'
import '../styles/tailwind-tools.css'
import { MealBuilder } from './components/meal-builder/MealBuilder'
import { NutritionResults } from './components/results/NutritionResults'
import { useNutrition } from './hooks/useNutrition'
import type { MealIngredient } from './components/ingredient-card/IngredientCard'
import type { FoodItemRequest } from './types/api'

type AppState = 'building' | 'results'

export default function App() {
  const [screen, setScreen] = useState<AppState>('building')
  const [ingredients, setIngredients] = useState<MealIngredient[]>([])
  const { results, loading, error, predict, reset } = useNutrition()

  async function handleSubmit() {
    const items: FoodItemRequest[] = ingredients.map((ing) => ({
      name: ing.label,
      quantity: ing.quantity,
      unit: ing.unit,
      cookingMethod: ing.cookingMethod,
      measuredState: ing.measuredState,
      ingredientId: ing.ingredientId,
    }))
    await predict(items)
    setScreen('results')
  }

  function handleEdit() {
    setScreen('building')
  }

  function handleReset() {
    setIngredients([])
    reset()
    setScreen('building')
  }

  return (
    <div className="pn-calculator">
      <main className="max-w-lg mx-auto px-4 pt-10 pb-16">
        <h1 className="font-serif font-medium text-4xl leading-tight text-stone-900 mb-2">Calculator</h1>
        <p className="text-stone-600 leading-relaxed mb-8">
          Add what you ate, set each portion and how it was cooked, and get its nutrition.
        </p>

        {/* ── Meal builder ────────────────────────────────────── */}
        {screen === 'building' && (
          <>
            <h2 className="text-base font-semibold text-stone-700 mb-3">Build your meal</h2>
            <MealBuilder
              ingredients={ingredients}
              onChange={setIngredients}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </>
        )}

        {/* ── Results ─────────────────────────────────────────── */}
        {screen === 'results' && (
          <>
            {loading && (
              <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl p-6 text-stone-500 text-sm">
                <svg className="w-5 h-5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing…
              </div>
            )}

            {error && !loading && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-600">
                Error: {error}
                <button onClick={handleReset} className="ml-3 underline text-rose-500 text-xs">Retry</button>
              </div>
            )}

            {results && !loading && (
              <>
                <NutritionResults results={results} ingredients={ingredients} onClose={handleEdit} />
                <div className="mt-6 text-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl transition-colors"
                  >
                    Calculate another meal
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  )
}
