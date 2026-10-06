import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNewsItems } from '../utils/newsStore'

export default function EventsSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [newsItems] = useNewsItems()
  const published = newsItems.filter(i => i.status === 'Published')

  // Lightbox state
  const [activePhotoIdx, setActivePhotoIdx] = useState(null)

  // Items with valid photos for lightbox navigation
  const photoItems = published.filter(item => Boolean(item.photo))
  const currentItem = activePhotoIdx !== null ? photoItems[activePhotoIdx] : null

  const openLightbox = (item) => {
    const idx = photoItems.findIndex(p => p.id === item.id)
    if (idx !== -1) {
      setActivePhotoIdx(idx)
    }
  }

  const closeLightbox = () => {
    setActivePhotoIdx(null)
  }

  const prevPhoto = useCallback(() => {
    if (photoItems.length <= 1) return
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photoItems.length - 1))
  }, [photoItems.length])

  const nextPhoto = useCallback(() => {
    if (photoItems.length <= 1) return
    setActivePhotoIdx((prev) => (prev < photoItems.length - 1 ? prev + 1 : 0))
  }, [photoItems.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIdx === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activePhotoIdx, prevPhoto, nextPhoto])

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg)', minHeight: '80vh', paddingBottom: '5rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <span className="section-label">Events & Calendar</span>
            <h2 className="section-title">Upcoming <span className="text-orange">Events & News</span></h2>
            <div className="divider" />
            <p className="section-subtitle">
              Official ceremonies, state award ceremonies, and media coverage organised by the Global Icons Forum Society.
            </p>
          </motion.div>

          {/* Live News & Events Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {published.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                whileHover={{ y: -5, borderColor: 'rgba(224,90,36,0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.45)' }}
              >
                {/* Photo container with click-to-enlarge */}
                {item.photo && (
                  <div
                    onClick={() => openLightbox(item)}
                    style={{
                      height: 240,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'zoom-in',
                      background: '#09131c',
                    }}
                    className="event-card-image-wrapper"
                  >
                    <img
                      src={item.photo}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        display: 'block',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      className="event-card-img"
                    />

                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Zoom Badge Indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        background: 'rgba(10, 20, 30, 0.85)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        pointerEvents: 'none',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      Click to view full
                    </div>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: 'rgba(224,90,36,0.18)',
                      border: '1px solid rgba(224,90,36,0.3)',
                      color: '#e05a24',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                      {item.date}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                      lineHeight: 1.4,
                      cursor: item.photo ? 'pointer' : 'default',
                    }}
                    onClick={() => item.photo && openLightbox(item)}
                  >
                    {item.title}
                  </h3>

                  {item.excerpt && (
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                      {item.excerpt}
                    </p>
                  )}

                  {item.photo && (
                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => openLightbox(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: '#e05a24',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        View Full Image & Details →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FULL SCREEN LIGHTBOX MODAL FOR EVENTS
         ======================================================== */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 14, 22, 0.94)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: 'min(980px, 94vw)',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#0d1b26',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.85)',
                overflow: 'hidden',
              }}
            >
              {/* Image Container - Full view */}
              <div
                style={{
                  width: '100%',
                  maxHeight: '68vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#060c12',
                  padding: '0.75rem',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={currentItem.photo}
                  alt={currentItem.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '66vh',
                    objectFit: 'contain',
                    borderRadius: 8,
                    display: 'block',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  }}
                />
              </div>

              {/* Event Information Bar */}
              <div style={{ width: '100%', padding: '1.25rem 1.75rem', background: '#0e1d29' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: 'rgba(224,90,36,0.2)',
                    border: '1px solid rgba(224,90,36,0.4)',
                    color: '#e05a24',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {currentItem.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                    📅 {currentItem.date}
                  </span>
                  {photoItems.length > 1 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      {activePhotoIdx + 1} / {photoItems.length}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.35 }}>
                  {currentItem.title}
                </h2>

                {currentItem.excerpt && (
                  <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, margin: '0.5rem 0 0 0' }}>
                    {currentItem.excerpt}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e05a24'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ✕
              </button>

              {/* Navigation Arrows if multiple photos */}
              {photoItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevPhoto() }}
                    aria-label="Previous image"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '35%',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#e05a24'
                      e.currentTarget.style.transform = 'scale(1.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.65)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextPhoto() }}
                    aria-label="Next image"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '35%',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#e05a24'
                      e.currentTarget.style.transform = 'scale(1.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.65)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .event-card-image-wrapper:hover .event-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
