import type { ReferenceNutrition, NutritionResponse } from '../types'

interface Props {
  predicted: NutritionResponse[]
  reference: ReferenceNutrition
}

function deltaPct(predicted: number, reference: number, minDenominator: number): number {
  const denom = Math.max(Math.abs(reference), minDenominator)
  return Math.abs((predicted - reference) / denom) * 100
}

/** Indexed by how many of the four nutrients land within 15% of the reference. */
const BADGE_COLORS = [
  'bg-[#f4ddd7] text-[#7c2d20]',
  'bg-[#f4ddd7] text-[#7c2d20]',
  'bg-carrot-soft text-[#8a4a17]',
  'bg-[#e2ecdf] text-leaf-deep',
  'bg-leaf-deep text-paper',
]

export function AccuracyBadge({ predicted, reference }: Props) {
  const total = predicted.reduce(
    (acc, r) => ({
      energyKcal: acc.energyKcal + r.energyKcal,
      proteinG: acc.proteinG + r.proteinG,
      fatG: acc.fatG + r.fatG,
      carbohydratesG: acc.carbohydratesG + r.carbohydratesG,
    }),
    { energyKcal: 0, proteinG: 0, fatG: 0, carbohydratesG: 0 },
  )

  const deltas = [
    deltaPct(total.energyKcal, reference.energyKcal, 20),
    deltaPct(total.proteinG, reference.proteinG, 2),
    deltaPct(total.fatG, reference.fatG, 2),
    deltaPct(total.carbohydratesG, reference.carbohydratesG, 2),
  ]

  const passing = deltas.filter((d) => d <= 15).length

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold ${BADGE_COLORS[passing]}`}>
      {passing} of {deltas.length} within 15%
    </span>
  )
}
