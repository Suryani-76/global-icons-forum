import { useState } from 'react'
import { motion } from 'framer-motion'

const SOCIAL_LINKS = [
  {
    name: 'Facebook', color: '#1877f2', href: 'https://www.facebook.com/', followers: '12.4K',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram', color: '#e05a24', href: 'https://www.instagram.com/gif_society/', followers: '8.9K',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn', color: '#0f7ea3', href: 'https://www.linkedin.com/', followers: '22.1K',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube', color: '#cc0000', href: 'https://www.youtube.com/', followers: '5.3K',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    name: 'X (Twitter)', color: '#000000', href: 'https://twitter.com/', followers: '18.7K',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

function SocialCard({ platform, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit our ${platform.name} page`}
      onClick={() => window.open(platform.href, '_blank')}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.75rem', textDecoration: 'none', cursor: 'pointer',
      }}
    >
      {/* Icon box */}
      <motion.div
        animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.08 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 72, height: 72, borderRadius: 20,
          background: hovered ? platform.color : 'rgba(255,255,255,0.12)',
          border: `2px solid ${hovered ? platform.color : 'rgba(255,255,255,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff',
          boxShadow: hovered ? `0 8px 28px ${platform.color}66` : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {platform.icon}
      </motion.div>

      {/* Name */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
          color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)',
          textTransform: 'uppercase', transition: 'color 0.3s', marginBottom: '0.15rem',
        }}>
          {platform.name}
        </div>
        <div style={{
          fontSize: '0.7rem', color: hovered ? platform.color : 'rgba(255,255,255,0.4)',
          fontWeight: 600, transition: 'color 0.3s', letterSpacing: '0.04em',
        }}>
          {platform.followers} followers
        </div>
      </div>
    </motion.a>
  )
}

export default function FooterSection({ onTabChange }) {
  const navigate = (id) => { if (onTabChange) { onTabChange(id); window.scrollTo({ top: 0, behavior: 'instant' }) } }

  const NAV_LINKS = {
    'Organisation': [
      { label: 'About Us',         tab: 'about'   },
      { label: 'Our Mission',      tab: 'about'   },
      { label: 'Leadership',       tab: 'about'   },
      { label: 'Global Partners',  tab: 'about'   },
    ],
    'Recognition': [
      { label: 'Award Categories', tab: 'awards'  },
      { label: 'Past Awardees',    tab: 'awards'  },
      { label: 'Nominate',         tab: 'contact' },
      { label: 'Gallery',          tab: 'gallery' },
    ],
    'Engage': [
      { label: 'Testimonials',     tab: 'testimonials' },
      { label: 'Contact',          tab: 'contact'      },
      { label: 'Membership',       tab: 'membership'   },
    ],
  }

  return (
    <footer className="footer" id="footer">

      {/* Top */}
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand-logo">
              <img src="/logo.png" alt="Global Icons Forum Society"
                style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              Global Icons Forum Society
            </div>
            <p className="footer-brand-desc">
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Hyderabad:</strong> Second Floor, Samridhi Vasyam, Madhapur, Hyderabad, Telangana 500081<br />
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Vijayawada:</strong> Global Icons Forum Society, 24-29-211, Durga Puram, Gulabi Thota Road, Vijayawada 520003<br />
              info@oklut.com · +91-9014217124
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Nominations open for 2025 season</span>
            </div>
          </div>

          {Object.entries(NAV_LINKS).map(([title, links]) => (
            <div key={title}>
              <div className="footer-col-title">{title}</div>
              <ul className="footer-col-links">
                {links.map((link, i) => (
                  <li key={i}>
                    <button onClick={() => navigate(link.tab)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.58)', padding: 0, textAlign: 'left', transition: 'color 0.3s' }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.58)'}>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Social Icons */}
      <div className="container">
        <div className="footer-social-section">
          <h3 className="footer-social-title">Follow the Journey</h3>
          <p className="footer-social-subtitle">Join our global community across every platform</p>

          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ width: 80, height: 2, background: 'linear-gradient(90deg, #0f7ea3, #e05a24)', borderRadius: 2, margin: '0 auto 2.5rem', transformOrigin: 'center' }} />

          <div className="footer-social-icons" style={{ gap: '2rem' }}>
            {SOCIAL_LINKS.map((platform, i) => (
              <SocialCard key={i} platform={platform} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Global Icons Forum Society. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((item, i) => (
              <a key={i} href="#" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
