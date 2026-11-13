import { useCallback, useEffect, useRef } from 'react'

// Press-and-hold cadence for the ±5 stepper.
const INITIAL_DELAY_MS = 400
const REPEAT_MS = 75

interface HoldRepeatHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * Fires `action` once on press, then repeats while the pointer stays down
 * (after an initial delay) so holding +5 scrolls the value in a loop instead of
 * forcing ten taps. `action` may return `false` to signal a boundary was
 * reached (value hit its floor/ceiling), which stops the repeat.
 *
 * Pointer events cover touch + mouse; Enter/Space fire a single action so the
 * stepper stays keyboard-operable.
 */
export function useHoldRepeat(action: () => boolean | void): HoldRepeatHandlers {
  // Keep the latest action so the repeat interval never calls a stale closure —
  // otherwise it would keep adding to the value captured at press time and only
  // step once. Assigned in an effect (not during render) to satisfy react-hooks.
  const actionRef = useRef(action)
  useEffect(() => {
    actionRef.current = action
  })

  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (delayRef.current !== null) {
      clearTimeout(delayRef.current)
      delayRef.current = null
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button > 0) return // ignore non-primary mouse buttons
      stop()
      if (actionRef.current() === false) return // already at a boundary
      delayRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          if (actionRef.current() === false) stop()
        }, REPEAT_MS)
      }, INITIAL_DELAY_MS)
    },
    [stop],
  )

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      actionRef.current()
    }
  }, [])

  // Clear any pending timers if the button unmounts mid-hold.
  useEffect(() => stop, [stop])

  return { onPointerDown, onPointerUp: stop, onPointerLeave: stop, onKeyDown }
}
