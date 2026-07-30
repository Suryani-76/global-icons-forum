import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useInView } from 'framer-motion'
import CtaScene from './CtaScene'

export default function CtaBanner() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="cta-banner" id="join" ref={ref}>
      {/* 3D background canvas */}
      <div className="cta-banner-3d" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 2.5, 5], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <CtaScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="container">
        <div className="cta-banner-inner">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="section-label" style={{ justifyContent: 'center' }}>
              Be Part of History
            </span>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Join Our <span className="text-orange">Global Community</span>
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              Connect with over 5,000 icons from 120+ countries. Gain access to exclusive
              forums, summits, and recognition programmes that celebrate extraordinary
              achievements on a world stage.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <CtaButton />
              <a href="#about" className="btn-secondary">
                Discover More
              </a>
            </div>

            {/* Trust indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '🌐', number: '120+', label: 'Countries' },
                { icon: '🏆', number: '5,000+', label: 'Icons' },
                { icon: '🤝', number: '200+', label: 'Partners' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'var(--color-bg-card)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    borderRadius: 14,
                    padding: '1rem 1.75rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    minWidth: 120,
                  }}
                >
                  <div style={{ fontSize: '1.6rem' }}>{item.icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}>
                    {item.number}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.58)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// --- CTA button with 3D hover effect ---
function CtaButton() {
  const [hovered, setHovered] = [false, () => {}]
  return (
    <a
      href="#contact"
      className="btn-primary"
      style={{
        fontSize: '1rem',
        padding: '1rem 2.4rem',
        boxShadow: '0 4px 24px rgba(224, 90, 36, 0.25)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(224,90,36,0.42)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(224, 90, 36, 0.25)'
      }}
    >
      Become a Member
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  )
}
