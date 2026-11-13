import { useState, useRef, useCallback } from 'react'

const DELETE_THRESHOLD = 150

interface SwipeResult {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
  translateX: number
  isRevealing: boolean
  isExiting: boolean
}

export function useSwipe(onDelete: () => void): SwipeResult {
  const startXRef = useRef(0)
  const [translateX, setTranslateX] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const isRevealing = translateX < -40

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - startXRef.current
    if (delta < 0) setTranslateX(Math.max(delta, -DELETE_THRESHOLD * 1.5))
  }, [])

  const onTouchEnd = useCallback(() => {
    if (translateX < -DELETE_THRESHOLD) {
      setIsExiting(true)
      setTimeout(onDelete, 250)
    } else {
      setTranslateX(0)
    }
  }, [translateX, onDelete])

  return { handlers: { onTouchStart, onTouchMove, onTouchEnd }, translateX, isRevealing, isExiting }
}
