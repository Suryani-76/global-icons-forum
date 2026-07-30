import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

// Hero stat with count-up, starts after `delay` seconds
function HeroStat({ end, suffix, label, delay }) {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])
  const value = useCountUp(end, 1800, started, suffix)
  return (
    <div>
      <div className="hero-stat-number">{value}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.13, ease: [0.4, 0, 0.2, 1] },
  }),
}

// ---- Character-by-character animated word ----
function AnimatedWord({ word, color, startDelay = 0 }) {
  return (
    <span style={{ display: 'inline-block', color: color || 'inherit' }}>
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: startDelay + i * 0.042,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

const STATS = [
  { end: 120,  suffix: '+',  label: 'Countries Represented' },
  { end: 5000, suffix: '+',  label: 'Icons Recognised'      },
  { end: 18,   suffix: '',   label: 'Years of Excellence'   },
]

export default function HeroSection({ onTabChange }) {
  const navigate = (tab) => {
    if (onTabChange) onTabChange(tab)
  }

  return (
    <section className="hero" id="home" aria-label="Hero">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>

        {/* ---- Left: Content ---- */}
        <div className="hero-content">
          <motion.div
            className="hero-eyebrow"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Celebrating Global Excellence
          </motion.div>

          {/* ---- Character-by-character title ---- */}
          <div style={{ perspective: 800, marginBottom: '1.5rem' }}>
            <h1 className="hero-title" style={{ margin: 0 }}>
              <div style={{ display: 'block', marginBottom: '0.1em' }}>
                <AnimatedWord word="Global" startDelay={0.18} />{' '}
                <AnimatedWord word="Icons" color="#e05a24" startDelay={0.48} />
              </div>
              <div style={{ display: 'block' }}>
                <AnimatedWord word="Forum" startDelay={0.78} />{' '}
                <AnimatedWord word="Society" startDelay={1.0} />
              </div>
            </h1>
          </div>

          <motion.p
            className="hero-description"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            A prestigious international platform that recognises extraordinary
            individuals and organisations driving positive change across the globe.
            Where leadership meets legacy.
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <button onClick={() => navigate('awards')} className="btn-primary">
              Explore Awards
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={() => navigate('about')} className="btn-secondary">Learn More</button>
          </motion.div>

          <motion.div
            className="hero-stats"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            {STATS.map((s, i) => (
              <HeroStat key={i} end={s.end} suffix={s.suffix} label={s.label} delay={1.6 + i * 0.15} />
            ))}
          </motion.div>
        </div>

        {/* ---- Right: Logo Image ---- */}
        <motion.div
          className="hero-3d-panel"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-hidden="true"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
              style={{
                position: 'absolute',
                width: 480, height: 480,
                borderRadius: '50%',
                border: '1.5px solid rgba(15,126,163,0.2)',
              }}
            />
            {/* Inner counter-rotating dashed ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
              style={{
                position: 'absolute',
                width: 400, height: 400,
                borderRadius: '50%',
                border: '1.5px dashed rgba(224,90,36,0.25)',
              }}
            />
            {/* Glow blob */}
            <div style={{
              position: 'absolute',
              width: 340, height: 340,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15,126,163,0.08) 0%, transparent 68%)',
              filter: 'blur(24px)',
            }} />

            {/* Logo — always floating, always visible */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
              style={{ position: 'relative', zIndex: 10 }}
            >
              <img
                src="/logo.png"
                alt="Global Icons Forum Society"
                style={{
                  width: 'clamp(280px, 34vw, 420px)',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 24,
                  boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 4px 24px rgba(0,0,0,0.2)',
                }}
              />
            </motion.div>

            {/* Ground shadow */}
            <div style={{
              position: 'absolute',
              bottom: -30,
              width: 260, height: 22,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }} />
          </div>
        </motion.div>
      </div>

    </section>
  )
}
