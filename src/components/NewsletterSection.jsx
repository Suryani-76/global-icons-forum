import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const NEWS_PHOTOS = Array.from({ length: 25 }, (_, i) => `/news${i + 1}.jpeg`)

// ---- Lightbox ----
function Lightbox({ index, onClose, onPrev, onNext }) {
  if (index === null) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          zIndex: 10000, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '2rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ position: 'relative', maxWidth: 'min(900px, 90vw)', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <img
            src={NEWS_PHOTOS[index]}
            alt={`News ${index + 1}`}
            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
          />
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
            {index + 1} / {NEWS_PHOTOS.length}
          </div>
        </motion.div>

        {/* Close */}
        <button onClick={onClose} aria-label="Close"
          style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10001 }}>✕</button>

        {/* Prev */}
        <button onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Previous"
          style={{ position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10001 }}>‹</button>

        {/* Next */}
        <button onClick={e => { e.stopPropagation(); onNext() }} aria-label="Next"
          style={{ position: 'fixed', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10001 }}>›</button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function NewsletterSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const prevImage = useCallback(() => setLightbox(i => (i - 1 + NEWS_PHOTOS.length) % NEWS_PHOTOS.length), [])
  const nextImage = useCallback(() => setLightbox(i => (i + 1) % NEWS_PHOTOS.length), [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    const subject = encodeURIComponent('Newsletter Subscription — Global Icons Forum Society')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nPlease subscribe me to the Global Icons Forum Society newsletter.`)
    window.location.href = `mailto:info@oklut.com?subject=${subject}&body=${body}`
    setSubscribed(true)
  }

  return (
    <div ref={sectionRef}>

      {/* ===== NEWS PHOTOS ===== */}
      <section className="section" style={{ background: 'var(--color-bg)', paddingBottom: '2rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Latest Updates</span>
            <h2 className="section-title">News & <span className="text-orange">Announcements</span></h2>
            <div className="divider" />
            <p className="section-subtitle">Stay informed with the latest news, event announcements and updates from the Global Icons Forum Society.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2rem' }}>
            {NEWS_PHOTOS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => setLightbox(i)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <img
                  src={src}
                  alt={`News ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                {/* Number badge */}
                <div style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(224,90,36,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: '#fff', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  {i + 1}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.58)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Click any photo to view full size
          </motion.div>
        </div>
      </section>

      <Lightbox index={lightbox} onClose={() => setLightbox(null)} onPrev={prevImage} onNext={nextImage} />

      {/* ===== NEWSLETTER SIGNUP ===== */}
      <section style={{ background: 'var(--color-bg-deep)', borderTop: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

            {/* Left — info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
              <span className="section-label">Newsletter</span>
              <h2 className="section-title">Stay <span className="text-orange">Connected</span></h2>
              <div className="divider" />
              <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
                Subscribe to the Global Icons Forum Society newsletter and never miss an update on award announcements, summit invitations, fellowship opportunities and community news.
              </p>

              {/* Benefits list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { icon: '🏆', text: 'Award announcements & nomination windows' },
                  { icon: '📅', text: 'Upcoming events, summits & workshops' },
                  { icon: '🎓', text: 'Fellowship & scholarship opportunities' },
                  { icon: '🌐', text: 'Global community news & impact stories' },
                  { icon: '🤝', text: 'Partnership & collaboration updates' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Subscriber count */}
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex' }}>
                  {['#e05a24','#0a5a77','#f7c430','#22c55e'].map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.3)', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>2,400+ subscribers</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Join our growing community</div>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', padding: '2.5rem', backdropFilter: 'blur(12px)' }}>
                {subscribed ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                    <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>You're Subscribed!</h3>
                    <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      Thank you for joining the Global Icons Forum Society newsletter. You'll receive our next update soon.
                    </p>
                    <button onClick={() => { setSubscribed(false); setEmail(''); setName('') }}
                      className="btn-secondary" style={{ marginTop: '1.5rem' }}>
                      Subscribe Another Email
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                      Subscribe to Our Newsletter
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                      Get the latest news delivered straight to your inbox. Unsubscribe anytime.
                    </p>

                    <form onSubmit={handleSubscribe} noValidate>
                      <div className="contact-form-group">
                        <label htmlFor="nl-name" style={{ color: 'rgba(255,255,255,0.9)' }}>Full Name</label>
                        <input id="nl-name" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                      </div>

                      <div className="contact-form-group">
                        <label htmlFor="nl-email" style={{ color: 'rgba(255,255,255,0.9)' }}>Email Address <span style={{ color: '#e05a24' }}>*</span></label>
                        <input id="nl-email" type="email" placeholder="your@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                      </div>

                      {/* Interests */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.75rem' }}>Interests (optional)</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {['Awards', 'Summits', 'Membership', 'Fellowships', 'Cultural Events', 'Social Welfare'].map((tag, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.85rem', borderRadius: 100, border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.88)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', userSelect: 'none' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
                        Subscribe Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                        </svg>
                      </button>

                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.5 }}>
                        By subscribing, you agree to receive updates from the Global Icons Forum Society. Your data is kept private and never shared.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
