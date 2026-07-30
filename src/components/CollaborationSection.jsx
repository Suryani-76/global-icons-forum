import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PARTNER_CATEGORIES = [
  {
    icon: '🏛️', color: '#ffffff', title: 'Government Bodies',
    partners: ['Ministry of Culture, India', 'Ministry of Education', 'State Government Departments', 'Municipal Corporations', 'Tourism Boards'],
  },
  {
    icon: '🎓', color: '#e05a24', title: 'Educational Institutions',
    partners: ['Universities & Colleges', 'Research Institutes', 'Skill Development Centres', 'IITs & IIMs', 'International Universities'],
  },
  {
    icon: '🏢', color: '#f7c430', title: 'Corporate Organisations',
    partners: ['Industry Associations', 'FICCI & CII Members', 'MSME Networks', 'Startup Ecosystems', 'Corporate CSR Partners'],
  },
  {
    icon: '🤝', color: '#22c55e', title: 'NGOs & Social Organisations',
    partners: ['National NGO Networks', 'Social Welfare Bodies', 'Community Development Orgs', 'Healthcare NGOs', 'Environmental Groups'],
  },
  {
    icon: '🌍', color: '#9b59b6', title: 'International Agencies',
    partners: ['UN-affiliated Bodies', 'Commonwealth Organisations', 'SAARC Networks', 'ASEAN Cultural Bodies', 'Global Peace Organisations'],
  },
  {
    icon: '👥', color: '#ffffff', title: 'Professional Associations',
    partners: ['Medical Associations', 'Legal Professional Bodies', 'Engineering Councils', 'Media & Press Associations', 'Film & Arts Councils'],
  },
]

const HOW_TO_PARTNER = [
  { icon: '📩', step: '01', title: 'Express Interest', desc: 'Send an email to info@oklut.com with your organisation details and partnership proposal.' },
  { icon: '📋', step: '02', title: 'Review & Discussion', desc: 'Our team reviews your proposal and schedules a discussion within 7 working days.' },
  { icon: '📝', step: '03', title: 'MOU Signing', desc: 'A formal Memorandum of Understanding is drafted and signed by authorised representatives.' },
  { icon: '🚀', step: '04', title: 'Collaboration Begins', desc: 'Joint programmes, events and initiatives are planned and executed for public welfare.' },
]

export default function CollaborationSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg-card)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Partnerships</span>
            <h2 className="section-title">Collaboration & <span className="text-orange">Partners</span></h2>
            <div className="divider" />
            <p className="section-subtitle">We collaborate with government bodies, educational institutions, corporate organisations, NGOs, international agencies and professional associations for public welfare and sustainable development.</p>
          </motion.div>

          {/* Partner categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '4rem' }}>
            {PARTNER_CATEGORIES.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.09, duration: 0.55 }}
                style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${cat.color}18`, border: `1.5px solid ${cat.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{cat.title}</div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cat.partners.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)', marginBottom: '0.45rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />{p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* How to partner */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
            <h3 style={{ marginBottom: '2rem', color: '#ffffff', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>How to <span style={{ color: '#e05a24' }}>Partner With Us</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {HOW_TO_PARTNER.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  style={{ background: 'var(--color-bg-mid)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
                  {i < 3 && <div style={{ position: 'absolute', top: '50%', right: -14, width: 14, height: 2, background: '#e8e8e8', zIndex: 1 }} />}
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{step.icon}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>STEP {step.step}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: '0.5rem' }}>{step.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}
            style={{ marginTop: '3rem', textAlign: 'center' }}>
            <a href="mailto:info@oklut.com?subject=Partnership%20Proposal" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.4rem' }}>
              Become a Partner
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
