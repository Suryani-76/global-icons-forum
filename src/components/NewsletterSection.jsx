import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNewspaperItems } from '../utils/newspaperStore'

// ---- Lightbox ----
function Lightbox({ item, onClose, onPrev, onNext, currentIdx, total }) {
  if (!item) return null
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
            src={item.photo}
            alt={item.headline || 'News coverage'}
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{item.headline}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
              {item.publication} {item.date ? `· ${item.date}` : ''}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
              {currentIdx + 1} / {total}
            </div>
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
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const [rawItems] = useNewspaperItems()
  const items = rawItems.filter(i => i.status !== 'Archived')

  const prevImage = useCallback(() => setLightboxIdx(i => (i - 1 + items.length) % items.length), [items.length])
  const nextImage = useCallback(() => setLightboxIdx(i => (i + 1) % items.length), [items.length])

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
            {items.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.4), ease: [0.4, 0, 0.2, 1] }}
                onClick={() => setLightboxIdx(i)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  background: 'var(--color-bg-card)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.photo}
                    alt={item.headline || `News ${i + 1}`}
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
                  {/* Category / Publication badge */}
                  <div style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 12, background: 'rgba(224,90,36,0.88)', fontSize: '0.68rem', color: '#fff', fontWeight: 700 }}>
                    {item.publication || item.category || 'News'}
                  </div>
                </div>
                {item.headline && (
                  <div style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', lineHeight: 1.35, marginBottom: '0.3rem' }}>
                      {item.headline}
                    </div>
                    {item.date && (
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        {item.date}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.58)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Click any photo to view full size
          </motion.div>
        </div>
      </section>

      <Lightbox
        item={lightboxIdx !== null ? items[lightboxIdx] : null}
        currentIdx={lightboxIdx || 0}
        total={items.length}
        onClose={() => setLightboxIdx(null)}
        onPrev={prevImage}
        onNext={nextImage}
      />

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
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>14,800+ Subscribers</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Across 120+ countries worldwide</div>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>
              <div style={{ background: 'var(--color-bg-card)', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Join Our Community</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>Receive monthly digests of award ceremonies, honouree stories, and global forum initiatives.</p>

                {subscribed ? (
                  <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                    <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.1rem', marginBottom: '0.35rem' }}>Subscription Request Initiated!</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem' }}>Your email client should open shortly to confirm your subscription.</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Dr. Priya Sharma"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.85rem 1rem', color: '#fff', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.85rem 1rem', color: '#fff', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ background: 'var(--color-orange)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.95rem 1.5rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 18px rgba(224,90,36,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(224,90,36,0.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(224,90,36,0.4)' }}
                    >
                      Subscribe to Newsletter →
                    </button>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                      🔒 Zero spam. Unsubscribe at any time with one click.
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  )
}
