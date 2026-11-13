import { useState } from 'react'
import type { MealIngredient } from '../ingredient-card/IngredientCard'
import type { NutritionalProfileResponse } from '../../types/api'
import { IngredientInfoPanel } from './IngredientInfoPanel'

interface NutritionResultsProps {
  results: NutritionalProfileResponse[]
  ingredients: MealIngredient[]
  onClose: () => void
}

type ExtraNutrientKey = Extract<
  keyof NutritionalProfileResponse,
  | 'saturatedFatG' | 'monounsaturatedFatG' | 'polyunsaturatedFatG'
  | 'sodiumMg' | 'potassiumMg' | 'calciumMg' | 'ironMg' | 'magnesiumMg'
  | 'phosphorusMg' | 'zincMg' | 'cholesterolMg' | 'waterG'
  | 'vitaminAUg' | 'vitaminCMg' | 'vitaminDUg' | 'vitaminB6Mg' | 'vitaminB12Ug' | 'niacinMg'
>

// Everything the API returns beyond the always-visible macros (energy/protein/fat/carbs/fiber/sugars).
// Shown only when at least one ingredient actually has a value for it — the source data coverage
// varies a lot between a curated ingredient, an ML prediction and an Open Food Facts product.
const EXTRA_NUTRIENTS: { key: ExtraNutrientKey; label: string; unit: string }[] = [
  { key: 'saturatedFatG', label: 'Saturated fat', unit: 'g' },
  { key: 'monounsaturatedFatG', label: 'Monounsaturated fat', unit: 'g' },
  { key: 'polyunsaturatedFatG', label: 'Polyunsaturated fat', unit: 'g' },
  { key: 'cholesterolMg', label: 'Cholesterol', unit: 'mg' },
  { key: 'sodiumMg', label: 'Sodium', unit: 'mg' },
  { key: 'potassiumMg', label: 'Potassium', unit: 'mg' },
  { key: 'calciumMg', label: 'Calcium', unit: 'mg' },
  { key: 'ironMg', label: 'Iron', unit: 'mg' },
  { key: 'magnesiumMg', label: 'Magnesium', unit: 'mg' },
  { key: 'phosphorusMg', label: 'Phosphorus', unit: 'mg' },
  { key: 'zincMg', label: 'Zinc', unit: 'mg' },
  { key: 'waterG', label: 'Water', unit: 'g' },
  { key: 'vitaminAUg', label: 'Vitamin A', unit: 'µg' },
  { key: 'vitaminCMg', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitaminDUg', label: 'Vitamin D', unit: 'µg' },
  { key: 'vitaminB6Mg', label: 'Vitamin B6', unit: 'mg' },
  { key: 'vitaminB12Ug', label: 'Vitamin B12', unit: 'µg' },
  { key: 'niacinMg', label: 'Niacin (B3)', unit: 'mg' },
]

function formatAmount(value: number, unit: string) {
  return `${unit === 'g' ? value.toFixed(1) : Math.round(value)} ${unit}`
}

function confidenceColor(c: number) {
  if (c >= 0.8) return 'text-emerald-600 bg-emerald-50'
  if (c >= 0.6) return 'text-amber-600 bg-amber-50'
  return 'text-rose-600 bg-rose-50'
}

function sourceLabel(s: string) {
  const map: Record<string, string> = {
    cache: 'Cache',
    ml: 'ML',
    off_direct: 'OpenFoodFacts',
    unavailable: 'Unavailable',
  }
  return map[s] ?? s
}

export function NutritionResults({ results, ingredients, onClose }: NutritionResultsProps) {
  // Index of the result whose info/report panel is open (results[i] ↔ ingredients[i]).
  const [panelIndex, setPanelIndex] = useState<number | null>(null)

  const total = results.reduce(
    (acc, r) => {
      if (!r.available) return acc
      const extras = { ...acc.extras }
      for (const { key } of EXTRA_NUTRIENTS) {
        const value = r[key]
        if (value != null) extras[key] = (extras[key] ?? 0) + value
      }
      return {
        energyKcal: acc.energyKcal + r.energyKcal,
        proteinG: acc.proteinG + r.proteinG,
        fatG: acc.fatG + r.fatG,
        carbohydratesG: acc.carbohydratesG + r.carbohydratesG,
        fiberG: r.fiberG != null ? acc.fiberG + r.fiberG : acc.fiberG,
        sugarsG: r.sugarsG != null ? acc.sugarsG + r.sugarsG : acc.sugarsG,
        hasFiber: acc.hasFiber || r.fiberG != null,
        hasSugars: acc.hasSugars || r.sugarsG != null,
        extras,
      }
    },
    {
      energyKcal: 0, proteinG: 0, fatG: 0, carbohydratesG: 0, fiberG: 0, sugarsG: 0,
      hasFiber: false, hasSugars: false,
      extras: {} as Partial<Record<ExtraNutrientKey, number>>,
    },
  )
  const totalExtras = EXTRA_NUTRIENTS.filter(({ key }) => total.extras[key] != null)

  return (
    <div className="flex flex-col gap-4">
      {/* Totals banner */}
      <div className="bg-indigo-600 text-white rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-indigo-200">Meal total</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <Macro label="Energy" value={`${Math.round(total.energyKcal)} kcal`} large />
          <Macro label="Protein" value={`${total.proteinG.toFixed(1)} g`} />
          <Macro label="Fat" value={`${total.fatG.toFixed(1)} g`} />
          <Macro label="Carbohydrates" value={`${total.carbohydratesG.toFixed(1)} g`} />
        </div>

        {(total.hasFiber || total.hasSugars) && (
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-3 pt-3 border-t border-white/15 text-xs text-indigo-100">
            {total.hasFiber && <span>Fiber: {total.fiberG.toFixed(1)} g</span>}
            {total.hasSugars && <span>Sugars: {total.sugarsG.toFixed(1)} g</span>}
          </div>
        )}

        {totalExtras.length > 0 && (
          <details className="mt-3 pt-3 border-t border-white/15">
            <summary className="text-xs font-medium text-indigo-200 cursor-pointer list-none flex items-center gap-1">
              Full nutrient breakdown
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs text-indigo-100">
              {totalExtras.map(({ key, label, unit }) => (
                <span key={key}>{label}: {formatAmount(total.extras[key] as number, unit)}</span>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Per-ingredient breakdown */}
      <div className="flex flex-col gap-3">
        {results.map((r, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-stone-800 flex-1 leading-snug">{r.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor(r.confidence)}`}>
                  {Math.round(r.confidence * 100)}%
                </span>
                <span className="text-xs text-stone-400">{sourceLabel(r.source)}</span>
                <button
                  type="button"
                  onClick={() => setPanelIndex(i)}
                  aria-label={`Info and report for ${r.name}`}
                  className="text-stone-300 hover:text-indigo-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {!r.available ? (
              <p className="text-xs text-rose-500">Data unavailable for this ingredient.</p>
            ) : (
              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs text-stone-600">
                <span>{Math.round(r.energyKcal)} kcal</span>
                <span>P: {r.proteinG.toFixed(1)} g</span>
                <span>F: {r.fatG.toFixed(1)} g</span>
                <span>C: {r.carbohydratesG.toFixed(1)} g</span>
                {r.fiberG != null && <span>Fiber: {r.fiberG.toFixed(1)} g</span>}
                {r.sugarsG != null && <span>Sugars: {r.sugarsG.toFixed(1)} g</span>}
              </div>
            )}

            <p className="text-xs text-stone-400 mt-2">
              {r.quantity} {r.unit} · {r.cookingMethod} · weighed {r.measuredState === 'raw' ? 'raw' : 'cooked'}
            </p>

            {r.available && (() => {
              const extras = EXTRA_NUTRIENTS.filter(({ key }) => r[key] != null)
              if (extras.length === 0) return null
              return (
                <details className="mt-2 pt-2 border-t border-stone-100">
                  <summary className="text-xs font-medium text-stone-500 cursor-pointer list-none flex items-center gap-1">
                    More nutrients
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs text-stone-500">
                    {extras.map(({ key, label, unit }) => (
                      <span key={key}>{label}: {formatAmount(r[key] as number, unit)}</span>
                    ))}
                  </div>
                </details>
              )
            })()}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 border border-stone-200 rounded-2xl text-sm text-stone-600 hover:bg-stone-50 transition-colors font-medium"
      >
        Edit meal
      </button>

      {panelIndex !== null && results[panelIndex] && (
        <IngredientInfoPanel
          ingredient={ingredients[panelIndex] ?? null}
          result={results[panelIndex]}
          onClose={() => setPanelIndex(null)}
        />
      )}
    </div>
  )
}

function Macro({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p className="text-xs text-indigo-300">{label}</p>
      <p className={`font-semibold ${large ? 'text-lg' : 'text-sm'}`}>{value}</p>
    </div>
  )
}

