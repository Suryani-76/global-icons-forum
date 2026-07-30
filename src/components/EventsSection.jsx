import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EVENTS = [
  { month: 'JUN', date: '15', year: '2025', title: 'Annual General Body Meeting', type: 'Governance', location: 'Hyderabad, Telangana', desc: 'The Annual General Body Meeting of the Society as per Rules & Regulations. All members are invited to attend.', status: 'upcoming', color: '#0f7ea3' },
  { month: 'AUG', date: '10', year: '2025', title: 'Global Icons Award Ceremony', type: 'Awards', location: 'Mumbai, Maharashtra', desc: 'Annual flagship award ceremony celebrating icons from business, arts, science, diplomacy and social impact.', status: 'upcoming', color: '#e05a24' },
  { month: 'SEP', date: '20', year: '2025', title: 'International Leadership Summit', type: 'Summit', location: 'New Delhi, India', desc: 'National summit bringing together global thought leaders to address pressing humanitarian and social challenges.', status: 'upcoming', color: '#f7c430' },
  { month: 'OCT', date: '05', year: '2025', title: 'Youth Empowerment Workshop', type: 'Workshop', location: 'Bengaluru, Karnataka', desc: 'Skill development, entrepreneurship and innovation workshop for youth aged 18–35 across India.', status: 'upcoming', color: '#22c55e' },
  { month: 'NOV', date: '18', year: '2025', title: 'Indian Heritage Cultural Festival', type: 'Cultural', location: 'Vijayawada, Andhra Pradesh', desc: 'Celebrating Indian heritage, literature, cinema and performing arts on a global stage.', status: 'upcoming', color: '#9b59b6' },
  { month: 'DEC', date: '12', year: '2025', title: 'Fellowship Awards Ceremony', type: 'Awards', location: 'Hyderabad, Telangana', desc: 'Annual fellowships and scholarships presentation for outstanding achievements and contributions to society.', status: 'upcoming', color: '#e05a24' },
  { month: 'MAR', date: '08', year: '2025', title: 'Women Empowerment Summit', type: 'Social Welfare', location: 'Chennai, Tamil Nadu', desc: 'Summit focused on women empowerment, entrepreneurship and leadership across sectors.', status: 'past', color: '#0f7ea3' },
  { month: 'JAN', date: '26', year: '2025', title: 'Republic Day Cultural Event', type: 'Cultural', location: 'Vijayawada, Andhra Pradesh', desc: 'Special Republic Day celebration promoting Indian heritage and national unity.', status: 'past', color: '#9b59b6' },
]

const TYPES = ['All', 'Awards', 'Summit', 'Workshop', 'Cultural', 'Governance', 'Social Welfare']

export default function EventsSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [filter, setFilter] = useState('All')
  const [showPast, setShowPast] = useState(false)

  const filtered = EVENTS.filter(e => {
    const typeMatch = filter === 'All' || e.type === filter
    const statusMatch = showPast ? true : e.status === 'upcoming'
    return typeMatch && statusMatch
  })

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Events & Calendar</span>
            <h2 className="section-title">Upcoming <span className="text-orange">Events</span></h2>
            <div className="divider" />
            <p className="section-subtitle">Stay up to date with our award ceremonies, summits, workshops, cultural festivals and General Body meetings.</p>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                  border: `1.5px solid ${filter === t ? '#e05a24' : 'rgba(255,255,255,0.35)'}`,
                  background: filter === t ? '#e05a24' : 'rgba(255,255,255,0.12)',
                  color: '#ffffff', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.25s ease',
                }}>
                {t}
              </button>
            ))}
            <button onClick={() => setShowPast(!showPast)}
              style={{
                marginLeft: 'auto', padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.12)',
                color: '#ffffff', cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
              {showPast ? 'Hide Past Events' : 'Show Past Events'}
            </button>
          </motion.div>

          {/* Events grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {filtered.map((event, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{
                  background: event.status === 'past' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden', display: 'flex', opacity: event.status === 'past' ? 0.7 : 1,
                  backdropFilter: 'blur(8px)',
                }}>
                {/* Date block */}
                <div style={{ width: 80, background: event.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{event.date}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{event.month}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem' }}>{event.year}</div>
                </div>
                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff', background: `${event.color}99`, borderRadius: 100, padding: '0.15rem 0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.type}</span>
                    {event.status === 'past' && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '0.15rem 0.55rem' }}>Past Event</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.35rem', lineHeight: 1.3 }}>{event.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {event.location}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: 0 }}>{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>No events found for this filter.</div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
            style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1rem', fontSize: '0.95rem' }}>Want to attend or sponsor an event?</p>
            <a href="mailto:info@oklut.com?subject=Event%20Registration%20Enquiry" className="btn-primary">
              Register Your Interest
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
