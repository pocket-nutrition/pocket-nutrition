import { useState } from 'react'
import { useNutritionApi } from '../hooks/useNutritionApi'
import { NutritionTable } from './NutritionTable'
import { AccuracyBadge } from './AccuracyBadge'
import type { ShowcaseExample, Category, NutritionResponse } from '../types'

interface Props {
  example: ShowcaseExample
}

// Same colours as the Food Dataset's badges for the matching food groups and states.
const CATEGORY_CHIP: Record<Category, { label: string; classes: string }> = {
  raw: { label: 'Raw', classes: 'bg-cream text-ink-soft' },
  cooked: { label: 'Cooked', classes: 'bg-carrot-soft text-[#8a4a17]' },
  dish: { label: 'Dish', classes: 'bg-[#f2e9d0] text-[#6e5518]' },
  vegetable: { label: 'Vegetable', classes: 'bg-[#e2ecdf] text-leaf-deep' },
  wine_spirit: { label: 'Wine & spirits', classes: 'bg-[#ecdfe7] text-[#55304a]' },
  industrial: { label: 'Packaged', classes: 'bg-[#dde9ec] text-[#274b58]' },
}

const SOURCE_LABEL: Record<NutritionResponse['source'], string> = {
  ml: 'Model',
  cache: 'Model (cached)',
  off_direct: 'Open Food Facts',
  unavailable: 'Unavailable',
}

function SkeletonRows() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 bg-cream rounded" />
      ))}
    </div>
  )
}

export function ExampleCard({ example }: Props) {
  const { data, loading, error } = useNutritionApi(example.request)
  const chip = CATEGORY_CHIP[example.category]
  const [showRequest, setShowRequest] = useState(false)

  const allAvailable = data ? data.every((r) => r.available) : null
  const avgConfidence = data ? data.reduce((s, r) => s + r.confidence, 0) / data.length : null
  const primarySource = data?.[0]?.source

  return (
    <article className="bg-white rounded-[18px] border border-line flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-[0_14px_30px_-22px_rgba(31,61,41,0.45)]">
      <div className="px-5 pt-5 pb-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif font-medium text-[1.3rem] leading-tight">{example.title}</h2>
          <p className="mt-1 text-[0.81rem] text-ink-soft">{example.description}</p>
        </div>
        <span className={`flex-none px-2.5 py-0.5 rounded-full text-xs font-semibold ${chip.classes}`}>
          {chip.label}
        </span>
      </div>

      <div className="px-5 pb-4 flex-1">
        {loading && <SkeletonRows />}

        {error && (
          <p className="text-[0.81rem] text-bad bg-bad/10 rounded-lg p-3">
            Couldn’t reach the Nutrition API right now. Try again in a moment.
          </p>
        )}

        {data && allAvailable && (
          <NutritionTable
            predicted={data}
            reference={example.reference}
            referenceSource={example.referenceSource}
          />
        )}

        {data && !allAvailable && (
          <p className="text-[0.81rem] text-[#8a4a17] bg-carrot-soft/60 rounded-lg p-3">
            No prediction yet: the model doesn’t know this food well enough.
          </p>
        )}
      </div>

      {data && allAvailable && (
        <div className="px-5 py-3 border-t border-line bg-paper flex items-center justify-between gap-2 flex-wrap text-[0.78rem]">
          <AccuracyBadge predicted={data} reference={example.reference} />
          <span className="text-ink-soft">
            {primarySource && SOURCE_LABEL[primarySource]}
            {avgConfidence !== null && ` · confidence ${(avgConfidence * 100).toFixed(0)}%`}
          </span>
        </div>
      )}

      {!loading && (
        <div className="border-t border-line">
          <button
            type="button"
            aria-expanded={showRequest}
            onClick={() => setShowRequest((v) => !v)}
            className="w-full px-5 py-2.5 flex items-center gap-1.5 text-[0.81rem] font-semibold text-leaf-deep cursor-pointer hover:bg-paper transition-colors"
          >
            {showRequest ? 'Hide the request' : 'View the request'}
            <span aria-hidden="true">{showRequest ? '↑' : '→'}</span>
          </button>
          {showRequest && (
            <pre className="mx-5 mb-4 p-3 bg-ink text-paper/85 text-[11px] font-mono leading-relaxed rounded-lg overflow-x-auto">
              {JSON.stringify(example.request, null, 2)}
            </pre>
          )}
        </div>
      )}
    </article>
  )
}
