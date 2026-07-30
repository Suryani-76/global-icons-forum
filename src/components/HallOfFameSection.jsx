import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useInView } from 'framer-motion'
import HallOfFameScene from './HallOfFameScene'
import { useCountUp } from '../hooks/useCountUp'

const AWARD_CATEGORIES = [
  {
    icon: '🏆',
    title: 'Global Icon of the Year',
    subtitle: 'The pinnacle of recognition',
    color: '#f7c430',
    borderColor: 'rgba(247,196,48,0.35)',
  },
  {
    icon: '⭐',
    title: 'Excellence in Innovation',
    subtitle: 'Redefining the possible',
    color: '#0f7ea3',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  {
    icon: '🕊️',
    title: 'Peace & Diplomacy Award',
    subtitle: 'Bridging nations & cultures',
    color: '#e05a24',
    borderColor: 'rgba(224,90,36,0.35)',
  },
]

const MILESTONES = [
  { end: 120,   suffix: '+',  label: 'Countries'        },
  { end: 5000,  suffix: '+',  label: 'Icons Honoured'   },
  { end: 18,    suffix: '',   label: 'Years of Legacy'  },
  { end: 200,   suffix: '+',  label: 'Global Partners'  },
]

function CounterStat({ end, suffix, label, inView }) {
  const value = useCountUp(end, 2000, inView, suffix)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800,
        color: '#f7c430',
        lineHeight: 1,
        textShadow: '0 0 24px rgba(247,196,48,0.4)',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)',
        marginTop: '0.4rem',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function HallOfFameSection() {
  const sectionRef  = useRef()
  const inView      = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      id="hall-of-fame"
      style={{
        position: 'relative',
        background: '#050505',
        overflow: 'hidden',
        padding: '8rem 0',
      }}
    >
      {/* 3D particle canvas — full bleed background */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <HallOfFameScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Dark vignette overlay */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.88) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* ---- Eyebrow ---- */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '1.25rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#f7c430',
            background: 'rgba(247,196,48,0.1)',
            border: '1px solid rgba(247,196,48,0.25)',
            padding: '0.4rem 1.2rem',
            borderRadius: '100px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f7c430', display: 'inline-block' }} />
            Hall of Fame
          </span>
        </motion.div>

        {/* ---- Title ---- */}
        <motion.h2
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          A Legacy of{' '}
          <span style={{
            color: '#f7c430',
            textShadow: '0 0 40px rgba(247,196,48,0.5)',
          }}>
            Global Excellence
          </span>
        </motion.h2>

        <motion.p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '1.05rem',
            maxWidth: 580,
            margin: '0 auto 4rem',
            lineHeight: 1.8,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          For 18 years, the Global Icons Forum Society has stood as the world's
          most prestigious stage for celebrating extraordinary human achievement.
        </motion.p>

        {/* ---- Animated counters ---- */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(247,196,48,0.15)',
            borderRadius: 20,
            padding: '2.5rem 3rem',
            marginBottom: '4.5rem',
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {MILESTONES.map((m, i) => (
            <CounterStat key={i} {...m} inView={inView} />
          ))}
        </motion.div>

        {/* ---- Award category spotlight cards ---- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {AWARD_CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 + i * 0.12 }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${cat.borderColor}`,
                borderRadius: 16,
                padding: '2rem 1.75rem',
                backdropFilter: 'blur(12px)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Gold glow top line */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
              }} />

              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{cat.icon}</div>

              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
                lineHeight: 1.3,
              }}>
                {cat.title}
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: cat.color,
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}>
                {cat.subtitle}
              </div>

              {/* Corner accent */}
              <div style={{
                position: 'absolute',
                bottom: -1, right: -1,
                width: 48, height: 48,
                background: `radial-gradient(circle at bottom right, ${cat.color}22, transparent 70%)`,
                borderRadius: '0 0 16px 0',
              }} />
            </motion.div>
          ))}
        </div>

        {/* ---- Bottom CTA ---- */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '3.5rem' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #f7c430, #e05a24)',
              color: '#000',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              padding: '0.9rem 2.2rem',
              borderRadius: 8,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 24px rgba(247,196,48,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(247,196,48,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(247,196,48,0.3)'
            }}
          >
            Nominate for Hall of Fame
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
