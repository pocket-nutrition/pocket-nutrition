/**
 * The one rounding rule this platform uses, stated explicitly because the target languages
 * disagree on ties and the disagreement is silent.
 *
 * `roundHalfUp(x) = floor(x + 0.5)` — a tie always goes to the larger value.
 *
 * | language | naive call                | 12.5 -> | agrees? |
 * |----------|---------------------------|---------|---------|
 * | JS/TS    | `Math.round(12.5)`        | 13      | yes     |
 * | Java     | `Math.round(12.5)`        | 13      | yes     |
 * | Swift    | `(12.5).rounded()`        | 13      | yes     |
 * | Kotlin   | `kotlin.math.round(12.5)` | 12      | NO      |
 *
 * `kotlin.math.round` is documented as "ties rounded towards even", so a straight port of
 * `Math.round` to Kotlin changes results. This is not hypothetical: `describeQuantity(80, ...,
 * portionG: 64)` computes `80 / 64 = 1.25`, then `round(1.25 * 10) / 10`. Half-up gives
 * "≈ 1,3 portion"; ties-to-even gives "≈ 1,2 portion". Same input, different label, no error
 * anywhere.
 *
 * Ports must use:
 *   Kotlin  `floor(x + 0.5).toInt()`   — NOT `kotlin.math.round`
 *   Swift   `(x + 0.5).rounded(.down)` — `.rounded()` also works, but be explicit
 *
 * The `rounding` vector suite pins the tie cases so a wrong port fails a test instead of
 * shipping a subtly different number.
 */
export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5)
}
