import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const BENEFITS = [
  { icon: '🏆', title: 'Recognition Platform', desc: 'Get recognised on a global stage alongside icons from 120+ countries.' },
  { icon: '🌐', title: 'International Network', desc: 'Connect with professionals, entrepreneurs, artists and changemakers worldwide.' },
  { icon: '📅', title: 'Exclusive Events', desc: 'Priority access to summits, award ceremonies, cultural festivals and networking events.' },
  { icon: '🎓', title: 'Fellowships & Scholarships', desc: 'Eligibility for society fellowships, scholarships and recognition awards.' },
  { icon: '📚', title: 'Knowledge Resources', desc: 'Access to research publications, media initiatives and digital knowledge platforms.' },
  { icon: '🤝', title: 'Collaborative Projects', desc: 'Participate in social welfare, youth empowerment and community development programmes.' },
]

const MEMBERSHIP_TYPES = [
  {
    type: 'General Member', icon: '🌱', fee: '₹100', period: 'per year',
    tagline: 'Start your journey',
    gradient: 'linear-gradient(135deg, #1189b0 0%, #0a5a77 100%)',
    borderColor: 'rgba(255,255,255,0.3)',
    features: ['Annual General Body voting rights','Access to events & summits','Society newsletter & publications','Networking with members'],
  },
  {
    type: 'Life Member', icon: '⭐', fee: '₹1,000', period: 'one time',
    tagline: 'Most chosen by icons', badge: 'Popular',
    gradient: 'linear-gradient(135deg, #e05a24 0%, #b84318 100%)',
    borderColor: 'rgba(224,90,36,0.65)',
    features: ['All General Member benefits','Lifetime membership card','Priority event registration','Eligibility for fellowship awards','Featured in Society directory'],
  },
  {
    type: 'Patron Member', icon: '👑', fee: '₹5,000', period: 'one time',
    tagline: 'Ultimate prestige',
    gradient: 'linear-gradient(135deg, #b8860b 0%, #f7c430 50%, #b8860b 100%)',
    borderColor: 'rgba(247,196,48,0.55)',
    features: ['All Life Member benefits','Special mention in publications','Invitation to exclusive galas','Advisory committee eligibility','Certificate of Patronage'],
  },
]

function MembershipCard({ m, i, inView, onApply }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.65 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${m.borderColor}`,
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)', transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.25)' }}>
      {/* Gradient header */}
      <div style={{ background: m.gradient, padding: '2rem 1.75rem 1.5rem', position: 'relative' }}>
        {m.badge && <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: 100, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.4)' }}>{m.badge}</span>}
        <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{m.icon}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.2rem' }}>{m.type}</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', marginBottom: '1.25rem', fontStyle: 'italic' }}>{m.tagline}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.8rem', color: '#ffffff', lineHeight: 1 }}>{m.fee}</span>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', paddingBottom: '0.4rem' }}>{m.period}</span>
        </div>
      </div>
      {/* Features */}
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem 1.75rem 1.75rem', backdropFilter: 'blur(8px)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
          {m.features.map((f, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.92)', marginBottom: '0.65rem', lineHeight: 1.5 }}>
              <span style={{ color: '#f7c430', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>{f}
            </li>
          ))}
        </ul>
        <button onClick={() => onApply(m.type)}
          style={{ width: '100%', padding: '0.82rem', borderRadius: 10, border: `1.5px solid ${m.borderColor}`, background: hovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)', color: '#ffffff', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.25s ease', letterSpacing: '0.03em' }}>
          Apply for {m.type}
        </button>
      </div>
    </motion.div>
  )
}

export default function MembershipSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', age: '', email: '', phone: '', address: '', type: 'General Member' })
  const [submitted, setSubmitted] = useState(false)

  const handleApply = (type) => { setForm(f => ({ ...f, type })); document.getElementById('membership-form')?.scrollIntoView({ behavior: 'smooth' }) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Membership Application — ${form.type} — ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nAge: ${form.age}\nEmail: ${form.email}\nPhone: ${form.phone}\nType: ${form.type}\nAddress: ${form.address}`)
    window.location.href = `mailto:info@oklut.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div ref={sectionRef}>
      {/* Hero */}
      <section className="section" style={{ background: 'var(--color-bg)', paddingBottom: '4rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ maxWidth: 700 }}>
            <span className="section-label">Join Us</span>
            <h2 className="section-title">Become a <span className="text-orange">Member</span></h2>
            <div className="divider" />
            <p className="section-subtitle">Any Indian citizen who has attained 18 years of age is eligible to become a member of the Global Icons Forum Society. Join a growing community of visionaries, leaders, and changemakers.</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Why Join</span>
            <h2 className="section-title">Member <span className="text-orange">Benefits</span></h2>
            <div className="divider" />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {BENEFITS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.55 }}
                style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.35rem' }}>{b.title}</div>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Types */}
      <section className="section" style={{ background: 'var(--color-bg-deep)', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Plans</span>
            <h2 className="section-title">Choose Your <span className="text-orange">Membership</span></h2>
            <div className="divider" style={{ margin: '1.25rem auto 1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>Select the membership level that fits your journey. Every tier gives you access to our growing global community.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {MEMBERSHIP_TYPES.map((m, i) => <MembershipCard key={i} m={m} i={i} inView={inView} onApply={handleApply} />)}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
            style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.42)' }}>
            All memberships subject to approval by the Executive Committee. Fees are non-refundable.
          </motion.p>
        </div>
      </section>

      {/* Application Form */}
      <section id="membership-form" className="section" style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
              <span className="section-label">Apply</span>
              <h2 className="section-title">Membership <span className="text-orange">Application</span></h2>
              <div className="divider" />
              <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, marginBottom: '2rem' }}>Fill in the form to apply for membership. Our team will review your application and respond within 7 working days.</p>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: '0.75rem' }}>Important Notes</div>
                {['Annual subscription of ₹100 due at the beginning of every year.','Must be paid within 3 months of year commencement.','Failure to pay forfeits membership and voting rights.','Office bearers are not paid from Society funds.'].map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.82)' }}>
                    <span style={{ color: '#e05a24', fontWeight: 700, flexShrink: 0 }}>•</span>{note}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.22)', padding: '2.5rem', backdropFilter: 'blur(12px)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Application Submitted!</h3>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>We'll respond within 7 working days.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '1.5rem' }}>Apply Again</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h3 style={{ marginBottom: '0.35rem', color: '#ffffff' }}>Apply for Membership</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.75rem' }}>All fields are required</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="contact-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="mem-name">Full Name</label>
                        <input id="mem-name" type="text" placeholder="Your full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div className="contact-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="mem-age">Age</label>
                        <input id="mem-age" type="number" placeholder="Min. 18" min="18" required value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="contact-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="mem-email">Email</label>
                        <input id="mem-email" type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div className="contact-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="mem-phone">Phone</label>
                        <input id="mem-phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="mem-type">Membership Type</label>
                      <select id="mem-type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        style={{ width: '100%', padding: '0.88rem 1.1rem', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#ffffff', background: 'var(--color-bg-card)', outline: 'none', cursor: 'pointer' }}>
                        {MEMBERSHIP_TYPES.map(m => <option key={m.type} value={m.type}>{m.type} — {m.fee} {m.period}</option>)}
                      </select>
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="mem-address">Full Address</label>
                      <textarea id="mem-address" rows={3} placeholder="Your complete residential address" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
                      Submit Application
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
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
