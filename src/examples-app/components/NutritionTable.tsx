import type { NutritionResponse, ReferenceNutrition } from '../types'

interface Props {
  predicted: NutritionResponse[]
  reference: ReferenceNutrition
  referenceSource: string
}

interface Row {
  label: string
  unit: string
  predicted: number
  reference: number
  minDenominator: number
  decimals: number
}

// Uses a floor on the denominator so that tiny absolute differences (< minDenominator)
// don't produce inflated percentages. E.g. 0.2 g fat error → 10% not 67%.
function deltaPct(predicted: number, reference: number, minDenominator: number): number {
  const denom = Math.max(Math.abs(reference), minDenominator)
  return ((predicted - reference) / denom) * 100
}

function gapColor(delta: number): string {
  const abs = Math.abs(delta)
  return abs <= 15 ? 'text-leaf-deep' : abs <= 30 ? 'text-carrot-deep' : 'text-bad'
}

function formatGap(delta: number): string {
  const sign = delta >= 0 ? '+' : '−'
  return `${sign}${Math.abs(delta).toFixed(1)}%`
}

// Infima styles every table on the site (stripes, cell borders, block display): the utilities
// below reset what this compact table doesn't want.
const CELL = 'px-0 py-2 bg-transparent'

export function NutritionTable({ predicted, reference, referenceSource }: Props) {
  const total = predicted.reduce(
    (acc, r) => ({
      energyKcal: acc.energyKcal + r.energyKcal,
      proteinG: acc.proteinG + r.proteinG,
      fatG: acc.fatG + r.fatG,
      carbohydratesG: acc.carbohydratesG + r.carbohydratesG,
    }),
    { energyKcal: 0, proteinG: 0, fatG: 0, carbohydratesG: 0 },
  )

  const rows: Row[] = [
    { label: 'Energy', unit: 'kcal', predicted: total.energyKcal, reference: reference.energyKcal, minDenominator: 20, decimals: 0 },
    { label: 'Protein', unit: 'g', predicted: total.proteinG, reference: reference.proteinG, minDenominator: 2, decimals: 1 },
    { label: 'Fat', unit: 'g', predicted: total.fatG, reference: reference.fatG, minDenominator: 2, decimals: 1 },
    { label: 'Carbs', unit: 'g', predicted: total.carbohydratesG, reference: reference.carbohydratesG, minDenominator: 2, decimals: 1 },
  ]

  return (
    <div>
      <table className="table w-full border-collapse m-0 text-sm">
        <thead>
          <tr className="bg-transparent font-mono text-[10.5px] tracking-[0.1em] uppercase text-ink-soft">
            <th className={`${CELL} text-left font-semibold border-b border-line`}>Nutrient</th>
            {/* Wide screens: two separate columns */}
            <th className={`${CELL} hidden sm:table-cell text-right font-semibold border-b border-line`}>Predicted</th>
            <th className={`${CELL} hidden sm:table-cell text-right font-semibold border-b border-line`}>Reference</th>
            {/* Narrow screens: one stacked column */}
            <th className={`${CELL} sm:hidden text-right font-semibold border-b border-line`}>Pred. / ref.</th>
            <th className={`${CELL} text-right font-semibold border-b border-line`}>Gap</th>
          </tr>
        </thead>
        <tbody className="font-mono text-[13px]">
          {rows.map((row) => {
            const delta = deltaPct(row.predicted, row.reference, row.minDenominator)
            return (
              <tr key={row.label} className="bg-transparent">
                <td className={`${CELL} font-sans text-sm`}>{row.label}</td>
                {/* Wide screens: separate cells */}
                <td className={`${CELL} hidden sm:table-cell text-right`}>
                  {row.predicted.toFixed(row.decimals)} <span className="text-ink-soft text-xs">{row.unit}</span>
                </td>
                <td className={`${CELL} hidden sm:table-cell text-right text-ink-soft`}>
                  {row.reference.toFixed(row.decimals)} <span className="text-xs">{row.unit}</span>
                </td>
                {/* Narrow screens: stacked predicted / reference */}
                <td className={`${CELL} sm:hidden text-right text-xs`}>
                  <div>{row.predicted.toFixed(row.decimals)} {row.unit}</div>
                  <div className="text-ink-soft">{row.reference.toFixed(row.decimals)} {row.unit}</div>
                </td>
                <td className={`${CELL} text-right font-semibold whitespace-nowrap ${gapColor(delta)}`}>
                  {formatGap(delta)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-ink-soft">Reference: {referenceSource}</p>
    </div>
  )
}
