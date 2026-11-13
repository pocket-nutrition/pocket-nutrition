import type { CookingMethod } from '../types/api'

export interface CookingMeta {
  method: CookingMethod
  label: string
  emoji: string
  headerText: string
  dropBg: string
  dropRing: string
}

export const COOKING_META: CookingMeta[] = [
  { method: 'raw',     label: 'Raw',     emoji: '🌿', headerText: 'text-emerald-700', dropBg: 'bg-emerald-50',  dropRing: 'ring-emerald-300' },
  { method: 'boiled',  label: 'Boiled',  emoji: '💧', headerText: 'text-blue-700',    dropBg: 'bg-blue-50',     dropRing: 'ring-blue-300' },
  { method: 'steamed', label: 'Steamed', emoji: '♨️', headerText: 'text-cyan-700',   dropBg: 'bg-cyan-50',     dropRing: 'ring-cyan-300' },
  { method: 'grilled', label: 'Grilled', emoji: '🔥', headerText: 'text-orange-700',  dropBg: 'bg-orange-50',   dropRing: 'ring-orange-300' },
  { method: 'roasted', label: 'Roasted', emoji: '🫕', headerText: 'text-amber-700',   dropBg: 'bg-amber-50',    dropRing: 'ring-amber-300' },
  { method: 'fried',   label: 'Fried',   emoji: '🍳', headerText: 'text-yellow-700',  dropBg: 'bg-yellow-50',   dropRing: 'ring-yellow-300' },
]

export function getCookingMeta(method: CookingMethod): CookingMeta {
  return COOKING_META.find((m) => m.method === method) ?? COOKING_META[0]
}
