import { motion } from 'framer-motion'

/* ============================================================
   ISO 9001:2015 Certification Banner
   Shown sitewide just below the hero section
   ============================================================ */
export default function IsoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #0a5a77 0%, #063d52 50%, #0a5a77 100%)',
        borderTop: '1px solid rgba(247,196,48,0.4)',
        borderBottom: '1px solid rgba(247,196,48,0.4)',
        padding: '0.85rem 0',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 3,
      }}
    >
      {/* Subtle gold shimmer line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #f7c430, transparent)',
        opacity: 0.7,
      }} />

      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '2rem', flexWrap: 'wrap',
        }}>

          {/* Gold medal icon + ISO text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f7c430, #c8963a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
              boxShadow: '0 0 16px rgba(247,196,48,0.55)',
            }}>
              🏅
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: '1rem', color: '#f7c430', lineHeight: 1.1, letterSpacing: '0.02em',
              }}>
                ISO 9001:2015 Certified
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.06em' }}>
                Quality Management System
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'rgba(247,196,48,0.3)', flexShrink: 0 }} />

          {/* Certificate details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Cert. No.', value: 'QMS/26M05315' },
              { label: 'Certified by', value: 'MQA Certification Services, London' },
              { label: 'Valid Until', value: '17 July 2029' },
              { label: 'Accredited by', value: 'UKAF-CB-011' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(247,196,48,0.75)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.1rem' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'rgba(247,196,48,0.3)', flexShrink: 0 }} />

          {/* View Certificate Button */}
          <a
            href="/iso-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: 'linear-gradient(135deg, #f7c430, #c8963a)',
              color: '#1a0e00', fontFamily: 'var(--font-body)',
              fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.06em',
              textDecoration: 'none', borderRadius: 8,
              padding: '0.45rem 1.1rem', flexShrink: 0,
              boxShadow: '0 2px 12px rgba(247,196,48,0.4)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            View Certificate
          </a>

        </div>
      </div>

      {/* Subtle gold shimmer at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #f7c430, transparent)',
        opacity: 0.7,
      }} />
    </motion.div>
  )
}
