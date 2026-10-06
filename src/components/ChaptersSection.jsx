import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useChapters } from '../utils/chaptersStore'

const DEFAULT_CHAPTERS = [
  { state: 'Andhra Pradesh', city: 'Vijayawada', type: 'Registered Office', status: 'Active', icon: '⭐' },
  { state: 'Telangana', city: 'Hyderabad', type: 'Operating Office', status: 'Active', icon: '⭐' },
  { state: 'Maharashtra', city: 'Mumbai', type: 'Chapter Office', status: 'Active', icon: '🟢' },
  { state: 'Karnataka', city: 'Bengaluru', type: 'Chapter Office', status: 'Active', icon: '🟢' },
  { state: 'Tamil Nadu', city: 'Chennai', type: 'Chapter Office', status: 'Active', icon: '🟢' },
  { state: 'Delhi NCR', city: 'New Delhi', type: 'Chapter Office', status: 'Active', icon: '🟢' },
  { state: 'West Bengal', city: 'Kolkata', type: 'Chapter Office', status: 'Upcoming', icon: '🔵' },
  { state: 'Gujarat', city: 'Ahmedabad', type: 'Chapter Office', status: 'Upcoming', icon: '🔵' },
  { state: 'Madhya Pradesh', city: 'Bhopal', type: 'Chapter Office', status: 'Upcoming', icon: '🔵' },
  { state: 'Rajasthan', city: 'Jaipur', type: 'Chapter Office', status: 'Upcoming', icon: '🔵' },
  { state: 'United Kingdom', city: 'London', type: 'International Chapter', status: 'Upcoming', icon: '🌍' },
  { state: 'United States', city: 'New York', type: 'International Chapter', status: 'Upcoming', icon: '🌎' },
]

export default function ChaptersSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [storedChapters] = useChapters()
  const chapters = storedChapters && storedChapters.length > 0 ? storedChapters : DEFAULT_CHAPTERS

  const stats = [
    { number: String(chapters.filter(c => c.type && c.type.toLowerCase().includes('office')).length || 2), label: 'Operating Offices', color: '#e05a24' },
    { number: `${chapters.filter(c => c.status?.toLowerCase() === 'active').length}+`, label: 'Active Chapters', color: '#ffffff' },
    { number: String(chapters.filter(c => c.type && c.type.toLowerCase().includes('international')).length || 2), label: 'International Chapters', color: '#f7c430' },
    { number: '120+', label: 'Countries Represented', color: '#ffffff' },
  ]

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
            {stats.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.25)', padding: '1.25rem', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.number}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem', fontWeight: 500 }}>{item.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⭐', label: 'Head / Operating Office' },
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {chapters.map((ch, i) => {
              const isActive = ch.status?.toLowerCase() === 'active'
              return (
                <motion.div key={ch.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.45 }}
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'}`,
                    padding: '1.25rem',
                    opacity: isActive ? 1 : 0.75,
                    backdropFilter: 'blur(8px)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{ch.icon || (isActive ? '🟢' : '🔵')}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700,
                      color: isActive ? '#22c55e' : '#93c5fd',
                      background: isActive ? 'rgba(34,197,94,0.2)' : 'rgba(147,197,253,0.2)',
                      borderRadius: 100, padding: '0.1rem 0.5rem',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {ch.status || 'Active'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#ffffff', marginBottom: '0.15rem' }}>{ch.city}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>{ch.state || ch.country}</div>
                  <div style={{ fontSize: '0.72rem', color: '#e05a24', fontWeight: 600, marginTop: '0.3rem' }}>{ch.type || 'Chapter Office'}</div>
                  {ch.contact && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>
                      Contact: {ch.contact}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '2rem', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.35rem' }}>Start a Chapter in Your City</div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Interested in establishing a Global Icons Forum Society chapter in your region? We welcome applications from dedicated individuals.</p>
            </div>
            <a href="mailto:info@oklut.com?subject=Chapter%20Establishment%20Enquiry" className="btn-primary" style={{ flexShrink: 0 }}>
              Enquire Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 6 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
