import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CHAPTERS = [
  { state: 'Andhra Pradesh', city: 'Vijayawada', type: 'Registered Office', status: 'active', icon: '⭐' },
  { state: 'Telangana', city: 'Hyderabad', type: 'Operating Office', status: 'active', icon: '⭐' },
  { state: 'Maharashtra', city: 'Mumbai', type: 'Chapter Office', status: 'active', icon: '🟢' },
  { state: 'Karnataka', city: 'Bengaluru', type: 'Chapter Office', status: 'active', icon: '🟢' },
  { state: 'Tamil Nadu', city: 'Chennai', type: 'Chapter Office', status: 'active', icon: '🟢' },
  { state: 'Delhi NCR', city: 'New Delhi', type: 'Chapter Office', status: 'active', icon: '🟢' },
  { state: 'West Bengal', city: 'Kolkata', type: 'Chapter Office', status: 'upcoming', icon: '🔵' },
  { state: 'Gujarat', city: 'Ahmedabad', type: 'Chapter Office', status: 'upcoming', icon: '🔵' },
  { state: 'Madhya Pradesh', city: 'Bhopal', type: 'Chapter Office', status: 'upcoming', icon: '🔵' },
  { state: 'Rajasthan', city: 'Jaipur', type: 'Chapter Office', status: 'upcoming', icon: '🔵' },
  { state: 'United Kingdom', city: 'London', type: 'International Chapter', status: 'upcoming', icon: '🌍' },
  { state: 'United States', city: 'New York', type: 'International Chapter', status: 'upcoming', icon: '🌎' },
]

const GLOBAL_REACH = [
  { number: '2',    label: 'Operating Offices',              color: '#e05a24' },
  { number: '8+',   label: 'State Chapters',                 color: '#ffffff' },
  { number: '2',    label: 'International Chapters (Soon)',  color: '#f7c430' },
  { number: '120+', label: 'Countries Represented',          color: '#ffffff' },
]

export default function ChaptersSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Our Presence</span>
            <h2 className="section-title">National & International <span className="text-orange">Chapters</span></h2>
            <div className="divider" />
            <p className="section-subtitle">
              Established to strengthen the Society's global outreach and impact, our chapters bring the Global Icons Forum Society closer to communities across India and the world.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {GLOBAL_REACH.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.25)', padding: '1.25rem', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.number}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem', fontWeight: 500 }}>{item.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⭐', label: 'Head Office' },
              { icon: '🟢', label: 'Active Chapter' },
              { icon: '🔵', label: 'Upcoming Chapter' },
              { icon: '🌍', label: 'International' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                <span>{l.icon}</span>{l.label}
              </div>
            ))}
          </div>

          {/* Chapters grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {CHAPTERS.map((ch, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                style={{
                  background: ch.status === 'active' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  border: `1px solid ${ch.status === 'active' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'}`,
                  padding: '1.25rem',
                  opacity: ch.status === 'upcoming' ? 0.75 : 1,
                  backdropFilter: 'blur(8px)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{ch.icon}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: ch.status === 'active' ? '#22c55e' : '#93c5fd',
                    background: ch.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(147,197,253,0.2)',
                    borderRadius: 100, padding: '0.1rem 0.5rem',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {ch.status === 'active' ? 'Active' : 'Upcoming'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', marginBottom: '0.15rem' }}>{ch.city}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>{ch.state}</div>
                <div style={{ fontSize: '0.72rem', color: '#e05a24', fontWeight: 600, marginTop: '0.3rem' }}>{ch.type}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
            style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '2rem', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.35rem' }}>Start a Chapter in Your City</div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Interested in establishing a Global Icons Forum Society chapter in your region? We welcome applications from dedicated individuals.</p>
            </div>
            <a href="mailto:info@oklut.com?subject=Chapter%20Establishment%20Enquiry" className="btn-primary" style={{ flexShrink: 0 }}>
              Enquire Now
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
