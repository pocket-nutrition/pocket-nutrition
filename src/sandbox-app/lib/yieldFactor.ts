// Yield = cooked weight / raw weight, resolved from Knowledge only.
// Mirrors the backend resolution (pocket-nutrition/ml router): Knowledge aggregates
// most yields under the generic "cooked" state key, with optional
// method-specific overrides. No invented fallback: if Knowledge has no yield,
// return 1 (no conversion) — the gap belongs in Knowledge (report it via the
// feedback channel), not guessed in the UI.
//
// This module is what is left of the former cookingDefaults.ts. The label-classification
// tables that lived alongside it (label → cooking method, label → portion grams) were
// deleted: the viewer must not carry food data. Cooking state and portion weight now come
// from the server (typicalState / servingG / portionMeasuredState), which defaults them
// when Knowledge has no value.
export function getYieldFactor(yieldFactors: Record<string, number>, method: string): number {
  if (method === 'raw') return 1
  return yieldFactors[method] ?? yieldFactors['cooked'] ?? 1
}
