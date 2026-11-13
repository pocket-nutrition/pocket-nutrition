import type { ServingUnit } from '../types/api'
import { roundHalfUp } from './rounding'

// Named coarse portion anchors for weight/volume ingredients.
export interface NamedAnchor {
  label: string
  factor: number
}

export const NAMED_ANCHORS: NamedAnchor[] = [
  { label: '¼',      factor: 0.25 },
  { label: 'Petite', factor: 0.5  },
  { label: '1 part', factor: 1.0  },
  { label: 'Grande', factor: 1.5  },
  { label: 'Double', factor: 2.0  },
]

// ── Unified steps (factor or serving-unit count) ───────────────────────────

export type UnifiedStep =
  | { kind: 'factor'; factor: number; label: string }
  | { kind: 'unit'; unit: ServingUnit; count: number }

export function stepRawWeight(step: UnifiedStep, basePortionG: number): number {
  return step.kind === 'factor'
    ? basePortionG * step.factor
    : step.unit.grams * step.count
}

const FRAC_LABELS: Record<number, string> = { 0.25: '¼', 0.33: '⅓', 0.5: '½', 0.75: '¾' }

export function stepLabel(step: UnifiedStep): string {
  if (step.kind === 'factor') return step.label
  const name = pluralFr(step.unit.labelFr, step.count)
  const fracLabel = FRAC_LABELS[step.count]
  if (fracLabel) return `${fracLabel} ${name}`
  return `${step.count} ${name}`
}

// ── Coarse anchors ─────────────────────────────────────────────────────────

const ITEM_COUNTS = [0.5, 1, 2, 3]

/** A short set of coarse, meaningful anchors used to label the current quantity
 *  (the collapsed-row summary via describeQuantity):
 *  - countable items use the item unit ("½ · 1 · 2 · 3 carottes"), never culinary units;
 *  - everything else uses named portion sizes ("¼ · Petite · 1 part · Grande · Double"). */
export function buildAnchors(
  basePortionG: number,
  servingUnits: ServingUnit[],
  servingMode?: string | null,
): UnifiedStep[] {
  const itemUnit = servingUnits.find(u => u.unit === 'item')
  if (servingMode === 'item' && itemUnit) {
    return ITEM_COUNTS
      .filter(count => itemUnit.grams * count >= 5)
      .map(count => ({ kind: 'unit' as const, unit: itemUnit, count }))
  }
  return NAMED_ANCHORS
    .filter(a => basePortionG * a.factor >= 1)
    .map(a => ({ kind: 'factor' as const, factor: a.factor, label: a.label }))
}

// ── Intelligent central label ──────────────────────────────────────────────

export interface ResolvedAnchor {
  label: string
  grams: number
}

export interface QuantityLabel {
  primary: string
  secondary: string
}

/** One decimal place. `n * 10` lands exactly on .5 for common ratios (80/64 = 1.25 -> 12.5), so
 *  the tie rule is load-bearing here — see roundHalfUp. */
function round1(n: number): number {
  return roundHalfUp(n * 10) / 10
}

/** French decimal comma; integers unchanged ("1,1", "2", "0,7"). */
export function frenchNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace('.', ',')
}

/** Naive French plural: singular below 2, append "s" otherwise (unless already ending in s).
 *  Real plural forms live in the knowledge base (set_ingredient_plural) — future improvement. */
export function pluralFr(label: string, count: number): string {
  if (count < 2 || label.endsWith('s')) return label
  return `${label}s`
}

function measureStr(g: number, displayUnit: 'g' | 'ml'): string {
  const suffix = displayUnit === 'ml' ? ' mL' : 'g'
  return g < 1 ? `< 1${suffix}` : `${roundHalfUp(g)}${suffix}`
}

export interface DescribeContext {
  servingMode?: string | null
  itemUnitG?: number
  itemLabel?: string
  portionG: number
  displayUnit: 'g' | 'ml'
}

/** Describe the current quantity for the collapsed summary: a clean anchor label when on/near one,
 *  otherwise a "≈ descriptor" headline with exact grams underneath. */
export function describeQuantity(
  currentG: number,
  anchors: ResolvedAnchor[],
  ctx: DescribeContext,
): QuantityLabel {
  const exact = measureStr(currentG, ctx.displayUnit)

  // 1. On an anchor (within 4 %) → its clean label, exact grams below.
  let hit: ResolvedAnchor | null = null
  let hitDist = Infinity
  for (const a of anchors) {
    const tol = Math.max(2, a.grams * 0.04)
    const d = Math.abs(currentG - a.grams)
    if (d <= tol && d < hitDist) { hit = a; hitDist = d }
  }
  if (hit) return { primary: hit.label, secondary: exact }

  // 2. Between anchors → "≈ descriptor" headline, exact grams below.
  if (ctx.itemUnitG && ctx.itemLabel) {
    const count = currentG / ctx.itemUnitG
    if (count >= 0.25) {
      const c = round1(count)
      return { primary: `≈ ${frenchNum(c)} ${pluralFr(ctx.itemLabel, c)}`, secondary: exact }
    }
  } else if (ctx.portionG > 0) {
    const f = currentG / ctx.portionG
    const named = NAMED_ANCHORS.find(a => Math.abs(f - a.factor) / a.factor <= 0.08)
    const primary = named ? `≈ ${named.label}` : `≈ ${frenchNum(round1(f))} portion`
    return { primary, secondary: exact }
  }

  // 3. Fallback (tiny item slivers): grams only.
  return { primary: exact, secondary: '' }
}
