import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AWARDS = [
  {
    color: 'blue',
    title: 'Global Icon of the Year',
    desc: 'The highest honour bestowed upon an individual who has demonstrated extraordinary global impact, leadership, and humanitarian vision.',
  },
  {
    color: 'orange',
    title: 'Excellence in Innovation',
    desc: 'Recognising pioneers whose technological and scientific breakthroughs are transforming industries and improving lives worldwide.',
  },
  {
    color: 'blue',
    title: 'Peace & Diplomacy Award',
    desc: 'Celebrating leaders who have made exceptional contributions to international peace, cross-cultural dialogue, and conflict resolution.',
  },
  {
    color: 'orange',
    title: 'Humanitarian Leadership',
    desc: 'Honouring those who selflessly dedicate their resources and influence toward alleviating suffering and uplifting communities.',
  },
  {
    color: 'blue',
    title: 'Business Icon of the Decade',
    desc: 'Presented to visionary entrepreneurs and executives who have reshaped global commerce with integrity and transformative impact.',
  },
  {
    color: 'orange',
    title: 'Cultural Excellence Award',
    desc: 'Celebrating icons in arts, culture, and heritage who preserve and propagate the richness of human civilisation across borders.',
  },
]

export default function AwardsSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section className="section awards" id="awards" ref={sectionRef}>
      <div className="container">
        <div className="awards-layout">

          {/* ---- Left: 3D Trophy ---- */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="awards-3d-wrap" aria-hidden="true" style={{ height: 480 }}>
              {/* Trophy image — floating animation */}
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Rotating halo rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                  style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: '1.5px solid rgba(247,196,48,0.25)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
                  style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1.5px dashed rgba(224,90,36,0.2)' }}
                />
                {/* Gold glow behind */}
                <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,196,48,0.18) 0%, transparent 70%)', filter: 'blur(24px)' }} />
                {/* Trophy image — transparent background */}
                <motion.img
                  src="/trophybg.png"
                  alt="Award Trophy"
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
                  style={{ width: 'clamp(220px, 28vw, 340px)', height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 24px 48px rgba(247,196,48,0.4)) drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}
                />
                {/* Ground glow */}
                <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: 200, height: 20, background: 'radial-gradient(ellipse, rgba(247,196,48,0.3) 0%, transparent 70%)', filter: 'blur(10px)' }} />
              </div>
              <div className="awards-glow" aria-hidden="true" />
            </div>

            {/* Award category chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              {['Business', 'Innovation', 'Diplomacy', 'Culture', 'Science', 'Philanthropy'].map((cat, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '0.4rem 1rem',
                  borderRadius: '100px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(224,90,36,0.35)',
                  color: '#ffffff',
                  border: `1px solid ${i % 2 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(224,90,36,0.6)'}`,
                  backdropFilter: 'blur(8px)',
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ---- Right: Awards list ---- */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="section-label">Recognition</span>
            <h2 className="section-title">
              Awards &amp; <span className="text-orange">Honours</span>
            </h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
              Our awards span every sphere of human achievement — from science and technology
              to peace, culture, and humanitarian service. Each recognition carries the weight
              of rigorous global selection.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {AWARDS.map((award, i) => (
                <motion.div
                  key={i}
                  className="award-item"
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.09 }}
                >
                  <div className={`award-dot ${award.color}`} />
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.02rem',
                      color: '#ffffff',
                      marginBottom: '0.25rem',
                    }}>
                      {award.title}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', lineHeight: '1.7', marginBottom: '1rem' }}>
                      {award.desc}
                    </p>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', marginBottom: '1rem' }} />
                  </div>
                </motion.div>
              ))}
            </div>

            <a href="#contact" className="btn-primary" style={{ marginTop: '1rem' }}>
              Nominate an Icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
