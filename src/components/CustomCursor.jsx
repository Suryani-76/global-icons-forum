import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX   = useMotionValue(-100)
  const cursorY   = useMotionValue(-100)
  const trailX    = useMotionValue(-100)
  const trailY    = useMotionValue(-100)

  const springX = useSpring(trailX, { stiffness: 80, damping: 18, mass: 0.5 })
  const springY = useSpring(trailY, { stiffness: 80, damping: 18, mass: 0.5 })

  const [hoveringLink, setHoveringLink] = useState(false)
  const [hoveringBtn,  setHoveringBtn ] = useState(false)
  const rafRef = useRef()

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    // Hide native cursor - DISABLED, keep normal cursor
    // document.body.style.cursor = 'none'

    const move = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return
      const isLink = el.closest('a, button, [role="button"], .wwd-card')
      const isBtn  = el.closest('.btn-primary, .btn-secondary')
      setHoveringLink(!!isLink)
      setHoveringBtn(!!isBtn)
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* Trailing aura */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          zIndex: 99998,
          pointerEvents: 'none',
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          animate={{
            width:   hoveringBtn  ? 64 : hoveringLink ? 52 : 36,
            height:  hoveringBtn  ? 64 : hoveringLink ? 52 : 36,
            opacity: hoveringBtn  ? 0.18 : hoveringLink ? 0.14 : 0.09,
            background: 'radial-gradient(circle, #000000 0%, transparent 70%)',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            borderRadius: '50%',
            filter: 'blur(8px)',
          }}
        />
      </motion.div>

      {/* Sharp dot */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          zIndex: 99999,
          pointerEvents: 'none',
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          animate={{
            width:  hoveringLink ? 10 : 6,
            height: hoveringLink ? 10 : 6,
            background: '#000000',
            boxShadow: hoveringLink
              ? '0 0 10px 3px rgba(0,0,0,0.4)'
              : '0 0 6px 1px rgba(0,0,0,0.25)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ borderRadius: '50%' }}
        />
      </motion.div>
    </>
  )
}
