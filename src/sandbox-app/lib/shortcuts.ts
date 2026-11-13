import type { ServingUnit } from '../types/api'
import { roundHalfUp } from './rounding'

/**
 * A single quick-shortcut shown under the value field.
 * - `multiplier`: overwrites the value with `basePortionG × factor` (Type A).
 * - `increment`: adds a fixed amount to the current value (Type B).
 */
export type Shortcut =
  | { kind: 'multiplier'; label: string; factor: number }
  | { kind: 'increment'; label: string; emoji?: string; grams: number }

// Cosmetic icon per serving-unit type, mirroring the closed SERVING_UNITS
// vocabulary (pocket-nutrition-knowledge/serving_unit_types.yaml), same spirit
// as cookingMeta.ts for cooking methods. Labels and gram weights come from
// Knowledge — only the icon is mapped here, and an unknown unit simply
// renders without one.
//
// Seven of the vocabulary's ten units are mapped. shot, bowl and scoop are
// deliberately absent: no glyph reads unambiguously as any of them, and a
// wrong icon is worse than none. That absence is contract, not omission —
// see the serving-unit-emoji suite.
const UNIT_EMOJI: Record<string, string> = {
  pinch: '🤏',
  teaspoon: '🥄',
  tablespoon: '🥄',
  cup: '🥣',
  handful: '✊',
  small_handful: '🤲',
  glass: '🥛',
}

/**
 * The icon for a serving-unit type, or `null` when it has none.
 *
 * Exported so the behavioural corpus can pin the whole map rather than the two
 * or three entries `shortcut-profile` happens to exercise. Without that, a
 * native client cannot reproduce this table from the contract: it either ships
 * an incomplete map or copies this source, and until 2026-08-03 this repo was
 * AGPL-3.0 while the clients are MPL-2.0, which made copying it the one thing
 * the licence boundary forbade.
 *
 * Returns `null` rather than `undefined` specifically so the emitted corpus
 * carries an explicit `"expected": null`. An absent key would be ambiguous —
 * a consumer could not tell "this unit has no icon" from "somebody forgot to
 * write an expected value" — and both native readers reject a case with no
 * `expected` at all. The increment objects inside `shortcut-profile` still omit
 * their `emoji` key, which is a different level and stays as it is.
 */
export function servingUnitEmoji(unit: string): string | null {
  return UNIT_EMOJI[unit] ?? null
}

// Type A — fixed multipliers of the Knowledge-provided base portion. Pure
// scaling (×0.5 / ×1 / ×2), no food-type classification.
const MULTIPLIERS: Shortcut[] = [
  { kind: 'multiplier', label: 'Demi', factor: 0.5 },
  { kind: 'multiplier', label: '1 Part', factor: 1 },
  { kind: 'multiplier', label: 'Double', factor: 2 },
]

const MAX_INCREMENTS = 3

export interface ShortcutInput {
  servingUnits: ServingUnit[]
  displayUnit: 'g' | 'ml'
}

/**
 * Builds the ≤4 hybrid shortcuts shown under the value field.
 *
 * The calculator never guesses: multipliers are a pure scaling of `basePortionG`,
 * and volumetric increments come strictly from the Knowledge-provided
 * `servingUnits`. When Knowledge supplies no serving units, only the three base
 * multipliers are shown — that gap is a signal to enrich Knowledge, not to
 * invent values here.
 */
export function resolveShortcutProfile({ servingUnits, displayUnit }: ShortcutInput): Shortcut[] {
  const increments: Shortcut[] = servingUnits
    .filter((u) => u.unit !== 'item') // the item is already covered by the multipliers
    .map((u) => ({
      kind: 'increment' as const,
      label: u.labelFr,
      emoji: UNIT_EMOJI[u.unit],
      grams: roundHalfUp(displayUnit === 'ml' ? u.volumeMl : u.grams),
    }))
    .filter((s) => s.grams >= 1)

  if (increments.length === 0) return MULTIPLIERS

  // One canonical portion anchor + up to 3 Knowledge increments (≤ 4 total).
  return [{ kind: 'multiplier', label: '1 Part', factor: 1 }, ...increments.slice(0, MAX_INCREMENTS)]
}
