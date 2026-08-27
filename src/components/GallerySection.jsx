import { useState, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const IMAGES = [
  { src: '/gallery14.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { src: '/gallery15.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { src: '/gallery20.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { src: '/gallery18.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { src: '/gallery19.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { src: '/photo 1.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 2.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 3.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 4.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 5.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 6.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 7.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 8.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 9.jpeg',  caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 10.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 11.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 12.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 13.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 14.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 15.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 16.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 17.jpeg', caption: 'Global Icons Forum — Excellence Event' },
  { src: '/photo 18.jpeg', caption: 'Global Icons Forum — Excellence Event' },
]

// ---- Lightbox ----
function Lightbox({ image, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          {/* Image */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 'min(900px, 90vw)',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={image.src}
              alt={image.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              }}
            />
            {/* Caption */}
            <div style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}>
              {image.caption}
            </div>
          </motion.div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'fixed', top: '1.5rem', right: '1.5rem',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10001,
            }}
          >✕</button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); onPrev() }}
            aria-label="Previous"
            style={{
              position: 'fixed', left: '1.5rem', top: '50%',
              transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: '1.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10001,
            }}
          >‹</button>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); onNext() }}
            aria-label="Next"
            style={{
              position: 'fixed', right: '1.5rem', top: '50%',
              transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: '1.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10001,
            }}
          >›</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function GallerySection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState(null) // index

  const openLightbox = (i) => setLightbox(i)
  const closeLightbox = () => setLightbox(null)
  const prevImage = useCallback(() => setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length), [])
  const nextImage = useCallback(() => setLightbox(i => (i + 1) % IMAGES.length), [])

  return (
    <>
      <section
        id="gallery"
        ref={sectionRef}
        style={{
          background: 'var(--color-bg-mid)',
          padding: '7rem 0',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div className="container">

          {/* Heading */}
          <motion.div
            style={{ marginBottom: '3.5rem' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Moments of Excellence</span>
            <h2 className="section-title">
              Our <span className="text-orange">Gallery</span>
            </h2>
            <div className="divider" />
            <p className="section-subtitle">
              Celebrating iconic moments — award ceremonies, press conferences,
              and recognition events across India and beyond.
            </p>
          </motion.div>

          {/* Uniform grid — no spans, no empty gaps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {IMAGES.map((img, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  onClick={() => openLightbox(i)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 14,
                    cursor: 'pointer',
                    aspectRatio: '4/3',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onHoverStart={e => {}}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />

                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.35s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '0.04em',
                        lineHeight: 1.4,
                      }}>
                        {img.caption}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.55)',
                        marginTop: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        Click to enlarge
                      </div>
                    </div>
                  </div>

                  {/* Orange accent corner */}
                  <div style={{
                    position: 'absolute',
                    top: 10, right: 10,
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(224,90,36,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: '#fff',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {i + 1}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            style={{
              textAlign: 'center',
              marginTop: '2.5rem',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.58)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Click any photo to view full size
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        image={lightbox !== null ? IMAGES[lightbox] : null}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </>
  )
}
