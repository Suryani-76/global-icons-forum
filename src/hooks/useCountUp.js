import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 → end when `inView` becomes true.
 * @param {number}  end       Target number
 * @param {number}  duration  Animation duration in ms
 * @param {boolean} inView    Trigger
 * @param {string}  suffix    Appended after number (e.g. '+', 'K')
 */
export function useCountUp(end, duration = 1800, inView = false, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix)
  const frameRef = useRef()
  const started  = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const startTime = performance.now()
    const isDecimal = String(end).includes('.')

    const tick = (now) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * end

      setDisplay(
        (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [inView, end, duration, suffix])

  return display
}
