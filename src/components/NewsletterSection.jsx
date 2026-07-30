import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const RECENT_NEWS = [
  {
    date: 'July 2025',
    tag: 'Awards',
    tagColor: '#e05a24',
    title: 'Global Icons Forum Society Announces 2025 Award Categories',
    excerpt: 'We are proud to announce the expanded award categories for the 2025 season, celebrating excellence across 12 new domains including AI & Technology and Social Innovation.',
  },
  {
    date: 'June 2025',
    tag: 'Summit',
    tagColor: '#f7c430',
    title: 'International Leadership Summit Coming to New Delhi',
    excerpt: 'The Global Icons Forum Society will host its flagship International Leadership Summit in New Delhi this September, bringing together 500+ global leaders.',
  },
  {
    date: 'May 2025',
    tag: 'Membership',
    tagColor: '#22c55e',
    title: 'Membership Drive 2025 — Join the Community of Icons',
    excerpt: 'Applications are now open for the 2025 membership drive. Connect with icons from 120+ countries and gain access to exclusive summits, recognition programmes and global events.',
  },
  {
    date: 'April 2025',
    tag: 'Chapters',
    tagColor: '#9b59b6',
    title: 'New Chapters Launched in Mumbai and Bengaluru',
    excerpt: 'The Society officially inaugurated new chapter offices in Mumbai and Bengaluru, expanding our national presence and bringing our programmes closer to more communities.',
  },
  {
    date: 'March 2025',
    tag: 'Social Welfare',
    tagColor: '#0f7ea3',
    title: 'Women Empowerment Summit 2025 — A Resounding Success',
    excerpt: 'Over 300 women leaders participated in the Society\'s annual Women Empowerment Summit in Chennai, resulting in 15 new mentorship partnerships and 3 community initiatives.',
  },
  {
    date: 'February 2025',
    tag: 'Heritage',
    tagColor: '#c084fc',
    title: 'Indian Heritage & Culture Festival Draws Global Audience',
    excerpt: 'The Global Icons Forum Society\'s annual cultural festival attracted participants from 28 countries, showcasing Indian arts, literature, cinema and performing arts.',
  },
]

export default function NewsletterSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [activeNews, setActiveNews] = useState(null)

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

      {/* ===== NEWS CARDS ===== */}
      <section className="section" style={{ background: 'var(--color-bg)', paddingBottom: '2rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Latest Updates</span>
            <h2 className="section-title">News & <span className="text-orange">Announcements</span></h2>
            <div className="divider" />
            <p className="section-subtitle">Stay informed with the latest news, event announcements and updates from the Global Icons Forum Society.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {RECENT_NEWS.map((news, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                onClick={() => setActiveNews(activeNews === i ? null : i)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 16,
                  border: `1px solid ${activeNews === i ? news.tagColor + '66' : 'rgba(255,255,255,0.2)'}`,
                  padding: '1.5rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: activeNews === i ? `0 8px 32px ${news.tagColor}33` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: news.tagColor, opacity: activeNews === i ? 1 : 0, transition: 'opacity 0.3s' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffffff', background: `${news.tagColor}99`, borderRadius: 100, padding: '0.2rem 0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {news.tag}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{news.date}</span>
                </div>

                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.4, marginBottom: '0.6rem' }}>
                  {news.title}
                </div>

                {activeNews === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0, marginTop: '0.5rem' }}>
                    {news.excerpt}
                  </motion.p>
                )}

                <div style={{ fontSize: '0.75rem', color: news.tagColor, fontWeight: 600, marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {activeNews === i ? 'Close' : 'Read more'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: activeNews === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
