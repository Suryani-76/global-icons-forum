import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PARTNERS = [
  'United Nations Foundation',
  'World Economic Alliance',
  'Global Peace Institute',
  'Asia Leadership Forum',
  'Africa Icons Network',
  'European Heritage Council',
]

const TESTIMONIALS = [
  {
    quote: 'Being recognised by the Global Icons Forum Society was the most profound honour of my career. Their platform truly celebrates the breadth of human excellence.',
    name: 'Dr. Priya Sharma',
    title: 'Global Innovator of the Year 2023',
    initial: 'P',
    color: 'blue',
  },
  {
    quote: 'The Forum brings together the world\'s most extraordinary minds and hearts. It is more than an award — it is a movement that inspires civilisational progress.',
    name: 'Ambassador Jean-Paul Moreau',
    title: 'Peace & Diplomacy Awardee 2022',
    initial: 'J',
    color: 'orange',
  },
  {
    quote: 'No other organisation captures the spirit of global excellence with such elegance, integrity, and reach. A true beacon of international recognition.',
    name: 'Ms. Amara Osei',
    title: 'Humanitarian Leadership Award 2023',
    initial: 'A',
    color: 'blue',
  },
]

export default function PartnersSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <>
      {/* ---- Trusted By ---- */}
      <div className="partners" ref={sectionRef}>
        <div className="container">
          <p className="partners-title">Trusted & Recognised Globally</p>
          <div className="partners-logos">
            {PARTNERS.map((p, i) => (
              <motion.div
                key={i}
                className="partner-name"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Testimonials ---- */}
      <section className="section" style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }} id="testimonials">
        <div className="container">
          <motion.div
            style={{ marginBottom: '3.5rem' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Voices of Icons</span>
            <h2 className="section-title">
              What Our <span className="text-orange">Honourees</span> Say
            </h2>
            <div className="divider" />
          </motion.div>

          <div className="grid-3" style={{ gap: '1.75rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className="card"
                style={{ padding: '2rem', position: 'relative' }}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.13, duration: 0.65 }}
              >
                {/* Quote mark */}
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '4rem',
                  lineHeight: 1,
                  color: t.color === 'blue' ? 'var(--color-blue-light)' : 'var(--color-orange-light)',
                  marginBottom: '-0.5rem',
                  userSelect: 'none',
                }}>
                  &ldquo;
                </div>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: t.color === 'blue' ? 'var(--color-blue)' : 'var(--color-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}>
                    {t.initial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.58)' }}>{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
