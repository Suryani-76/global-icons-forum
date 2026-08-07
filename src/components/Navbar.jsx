import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const NAV_ITEMS = [
  { label: 'Home',         id: 'home'         },
  { label: 'About',        id: 'about'        },
  { label: 'Awards',       id: 'awards'       },
  { label: 'Events',       id: 'events'       },
  { label: 'Gallery',      id: 'gallery'      },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Membership',   id: 'membership'   },
  {
    label: 'More', id: 'more', dropdown: [
      { label: 'News',              id: 'newsletter' },
      { label: 'Partners',           id: 'partners'   },
      { label: 'Legal & Governance', id: 'legal'      },
    ],
  },
  { label: 'Contact',      id: 'contact'      },
]

export default function Navbar({ activeTab, onTabChange }) {
  const [scrolled,    setScrolled  ] = useState(false)
  const [mobileOpen,  setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll  = () => setScrolled(window.scrollY > 32)
    const handleResize  = () => { if (window.innerWidth > 768) setMobileOpen(false) }
    window.addEventListener('scroll',  handleScroll, { passive: true })
    window.addEventListener('resize',  handleResize)
    return () => {
      window.removeEventListener('scroll',  handleScroll)
      window.removeEventListener('resize',  handleResize)
    }
  }, [])

  const handleClick = (id) => {
    onTabChange(id)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container navbar-inner">

          {/* Logo */}
          <button
            onClick={() => handleClick('home')}
            className="navbar-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Global Icons Forum Society — Home"
          >
            <img
              src="/logo.png"
              alt="Global Icons Forum Society"
              style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Global Icons</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Forum Society</span>
            </span>
          </button>

          {/* Desktop tabs */}
          <ul className="navbar-nav" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} style={{ position: 'relative' }}
                onMouseEnter={item.dropdown ? (e) => e.currentTarget.querySelector('.dropdown-menu').style.display = 'block' : undefined}
                onMouseLeave={item.dropdown ? (e) => e.currentTarget.querySelector('.dropdown-menu').style.display = 'none' : undefined}>
                <button
                  onClick={() => !item.dropdown && handleClick(item.id)}
                  style={{
                    background: 'none', border: 'none', cursor: item.dropdown ? 'default' : 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    fontWeight: activeTab === item.id ? 700 : 500,
                    letterSpacing: '0.02em',
                    color: activeTab === item.id ? '#ffffff' : 'rgba(255,255,255,0.82)',
                    padding: '0.25rem 0', position: 'relative',
                    transition: 'color 0.3s ease',
                    display: 'flex', alignItems: 'center', gap: '0.2rem',
                  }}>
                  {item.label}
                  {item.dropdown && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                  )}
                  {!item.dropdown && activeTab === item.id && (
                    <motion.div layoutId="tab-underline"
                      style={{ position: 'absolute', bottom: -3, left: 0, right: 0, height: 2, background: '#e05a24', borderRadius: 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                  )}
                </button>
                {/* Dropdown */}
                {item.dropdown && (
                  <div className="dropdown-menu" style={{ display: 'none', position: 'absolute', top: '100%', left: 0, background: 'var(--color-bg-card)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '0.5rem', minWidth: 220, zIndex: 1001, marginTop: 6 }}>
                    {item.dropdown.map(sub => (
                      <button key={sub.id} onClick={() => handleClick(sub.id)}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.85rem', borderRadius: 7, border: 'none', background: activeTab === sub.id ? 'rgba(255,255,255,0.15)' : 'transparent', color: activeTab === sub.id ? '#ffffff' : 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: activeTab === sub.id ? 700 : 500, cursor: 'pointer', transition: 'background 0.2s ease' }}
                        onMouseEnter={e => { if (activeTab !== sub.id) e.target.style.background = 'rgba(255,255,255,0.1)' }}
                        onMouseLeave={e => { if (activeTab !== sub.id) e.target.style.background = 'transparent' }}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="navbar-cta">
            <button
              onClick={() => handleClick('contact')}
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
            >
              Nominate Now
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'transform 0.3s ease' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s ease' }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'transform 0.3s ease' }} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav-drawer open"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            aria-label="Mobile navigation"
          >
            <button
              className="mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {NAV_ITEMS.map((item) => (
              item.dropdown ? (
                <div key={item.id}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.75rem 0 0.25rem' }}>{item.label}</div>
                  {item.dropdown.map(sub => (
                    <button key={sub.id} onClick={() => handleClick(sub.id)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.55rem 0.5rem', fontSize: '0.9rem', fontWeight: activeTab === sub.id ? 700 : 500, color: activeTab === sub.id ? '#e05a24' : 'rgba(255,255,255,0.82)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button key={item.id} onClick={() => handleClick(item.id)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 0', fontSize: '1.05rem', fontWeight: activeTab === item.id ? 700 : 500, color: activeTab === item.id ? '#e05a24' : 'rgba(255,255,255,0.88)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                  {item.label}
                </button>
              )
            ))}
            <button
              onClick={() => handleClick('contact')}
              className="btn-primary"
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              Nominate Now
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
