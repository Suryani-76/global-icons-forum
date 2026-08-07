import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function EventsSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <span className="section-label">Events & Calendar</span>
            <h2 className="section-title">Upcoming <span className="text-orange">Events</span></h2>
            <div className="divider" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img
              src="/events.jpeg"
              alt="State Icons Awards Night — Invitation"
              style={{
                maxWidth: '520px',
                width: '100%',
                borderRadius: 16,
                boxShadow: '0 8px 48px rgba(0,0,0,0.35)',
                border: '2px solid rgba(224,90,36,0.4)',
                display: 'block',
              }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
