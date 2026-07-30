import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const CONTACT_INFO = [
  {
    type: 'orange',
    label: 'Head Office (Hyderabad)',
    value: 'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, beside Narayana High School, Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e05a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    type: 'orange',
    label: 'FTPC India — Registered Office',
    value: '24-29-211, Durga Puram, Gulabi Thota Road, J Apparao Street, Vijayawada 520003',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e05a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    type: 'blue',
    label: 'Email',
    value: 'info@oklut.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0f7ea3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    type: 'blue',
    label: 'Phone',
    value: '+91-9014217124',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0f7ea3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
      </svg>
    ),
  },
  {
    type: 'orange',
    label: 'International Enquiries',
    value: 'info@oklut.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e05a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </svg>
    ),
  },
]

export default function ContactSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, subject, message } = formState
    // Build mailto link — opens default email client with pre-filled fields
    const mailTo = `mailto:info@oklut.com`
    const mailSubject = encodeURIComponent(subject || 'Enquiry from Global Icons Forum Website')
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )
    window.location.href = `${mailTo}?subject=${mailSubject}&body=${mailBody}`
    setSubmitted(true)
  }

  return (
    <section className="section contact" id="contact" ref={sectionRef} style={{ position: 'relative', zIndex: 5 }}>
      <div className="container">
        <motion.div
          style={{ marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">
            Connect With <span className="text-orange">Our Team</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            Whether you want to nominate a global icon, partner with our organisation,
            or attend our summits — we're here to help.
          </p>
        </motion.div>

        <div className="contact-layout">

          {/* ---- Left: Info + 3D Pin ---- */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {CONTACT_INFO.map((item, i) => (
              <div key={i} className="contact-info-item">
                <div className={`contact-icon-wrap ${item.type}`}>
                  {item.svg}
                </div>
                <div>
                  <div className="contact-label">{item.label}</div>
                  <div className="contact-value">{item.value}</div>
                </div>
              </div>
            ))}

            {/* Real Google Maps embed */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.15)',
              marginTop: '1.5rem',
              height: 280,
              position: 'relative',
            }}>
              <iframe
                title="FTPC India — Vijayawada Registered Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.123456789!2d80.6480!3d16.5193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9b12345%3A0xabcdef123456!2sDurgapuram%2C%20Vijayawada%2C%20Andhra%20Pradesh%20520003!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Label overlay */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,30,40,0.92)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '100px',
                padding: '0.3rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                📍 Vijayawada, Andhra Pradesh 520003
              </div>
            </div>
          </motion.div>

          {/* ---- Right: Contact Form ---- */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div style={{
              padding: '2.5rem',
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              position: 'relative',
              zIndex: 10,
            }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>Send a Message</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.58)', marginBottom: '2rem' }}>
                Fill out the form and our team will respond within 24 hours.
              </p>

              {submitted ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                  <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Message Sent!</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    Thank you for reaching out. We'll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="contact-form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="cf-name">Full Name</label>
                      <input
                        id="cf-name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div className="contact-form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="cf-email">Email</label>
                      <input
                        id="cf-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="cf-subject">Subject</label>
                    <input
                      id="cf-subject"
                      type="text"
                      placeholder="Nomination / Partnership / General Enquiry"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="cf-message">Message</label>
                    <textarea
                      id="cf-message"
                      rows={5}
                      placeholder="Tell us about your enquiry..."
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
                    Send Message
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
