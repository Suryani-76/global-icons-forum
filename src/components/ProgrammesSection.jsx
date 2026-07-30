import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PROGRAMMES = [
  {
    id: 'fellowships',
    icon: '🎓',
    color: '#ffffff',
    bg: '#d6eef5',
    title: 'Fellowships & Scholarships',
    subtitle: 'Recognising Academic & Professional Excellence',
    desc: 'The Society institutes fellowships and scholarships for outstanding achievements and contributions to society across all sectors.',
    items: [
      'Annual Fellowship Awards for academic excellence',
      'Research scholarships for emerging scholars',
      'Professional excellence recognitions',
      'Community contribution awards',
      'Youth innovation grants',
    ],
  },
  {
    id: 'welfare',
    icon: '❤️',
    color: '#e05a24',
    bg: '#faeade',
    title: 'Social Welfare Programmes',
    subtitle: 'Building Stronger Communities',
    desc: 'Comprehensive social welfare activities targeting education, healthcare, environment, and community upliftment.',
    items: [
      'Education support for underprivileged children',
      'Healthcare awareness and free medical camps',
      'Environmental protection initiatives',
      'Women empowerment workshops',
      'Child welfare and senior citizen care programmes',
    ],
  },
  {
    id: 'youth',
    icon: '💡',
    color: '#f7c430',
    bg: '#fffde0',
    title: 'Youth Empowerment',
    subtitle: 'Nurturing Tomorrow\'s Leaders',
    desc: 'Dedicated programmes to support skill development, entrepreneurship, innovation and youth leadership.',
    items: [
      'Skill development training workshops',
      'Entrepreneurship mentorship programme',
      'Youth innovation challenges',
      'Leadership development camps',
      'Digital literacy and technology training',
    ],
  },
  {
    id: 'heritage',
    icon: '🎭',
    color: '#9b59b6',
    bg: '#f0e6ff',
    title: 'Indian Heritage & Culture',
    subtitle: 'Promoting India\'s Rich Legacy Globally',
    desc: 'Celebrating and propagating Indian heritage, culture, tourism, literature, cinema and performing arts on global platforms.',
    items: [
      'Cultural exchange programmes with global nations',
      'Indian classical arts promotion events',
      'Heritage tourism awareness campaigns',
      'Literature and cinema festivals',
      'Performing arts showcases and competitions',
    ],
  },
]

const cardV = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] } }),
}

export default function ProgrammesSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg-card)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3.5rem' }}>
            <span className="section-label">Programmes & Initiatives</span>
            <h2 className="section-title">What We <span className="text-orange">Offer</span></h2>
            <div className="divider" />
            <p className="section-subtitle">
              From fellowships to social welfare, youth empowerment to cultural preservation — our programmes are designed to create lasting positive impact across society.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem' }}>
            {PROGRAMMES.map((prog, i) => (
              <motion.div key={prog.id} id={prog.id} variants={cardV} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={i}
                style={{ background: 'var(--color-bg-card)', borderRadius: 18, border: `1.5px solid ${prog.color}33`, overflow: 'hidden', boxShadow: `0 4px 24px ${prog.color}18` }}>
                {/* Header */}
                <div style={{ background: prog.bg, padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: `1px solid ${prog.color}22` }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: `0 2px 12px ${prog.color}33`, flexShrink: 0 }}>
                    {prog.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.15rem' }}>{prog.title}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: prog.color, letterSpacing: '0.05em' }}>{prog.subtitle}</div>
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: '1.75rem 2rem' }}>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, marginBottom: '1.25rem' }}>{prog.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {prog.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.55rem' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: prog.color, flexShrink: 0, marginTop: 6 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: prog.color, background: prog.bg, border: `1px solid ${prog.color}44`, borderRadius: 8, padding: '0.45rem 1rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    Learn More
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
