import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const TESTIMONIALS = [
  {
    photo: '/news1.jpeg',
    name: 'Dr. Priya Sharma',
    title: 'Global Innovator of the Year 2023',
    nation: 'India',
    color: '#ffffff',
    quote: 'Being recognised by the Global Icons Forum was a watershed moment in my career. The platform amplifies voices that are truly making a difference, and the energy in that room was unlike anything I have ever experienced.',
  },
  {
    photo: '/news2.jpeg',
    name: 'Ambassador Jean-Paul Moreau',
    title: 'Peace & Diplomacy Awardee 2022',
    nation: 'France',
    color: '#e05a24',
    quote: 'The Global Icons Forum stands as a rare institution that genuinely bridges cultures and continents. This honour reaffirmed my belief that diplomacy and human connection are the most powerful tools we have for lasting peace.',
  },
  {
    photo: '/news3.jpeg',
    name: 'Ms. Amara Osei',
    title: 'Humanitarian Leadership Award 2023',
    nation: 'Ghana',
    color: '#f7c430',
    quote: 'Receiving this award on behalf of thousands of women I work with across West Africa was deeply moving. The Forum shines a global spotlight on grassroots change-makers who rarely get the recognition they deserve.',
  },
  {
    photo: '/news4.jpeg',
    name: 'Mr. Rajan Mehta',
    title: 'Business Icon of the Decade 2021',
    nation: 'Singapore',
    color: '#ffffff',
    quote: 'What sets the Global Icons Forum apart is the quality of the community it has built. Being part of this network has opened doors to collaborations across five continents and reshaped how I think about global business leadership.',
  },
  {
    photo: '/news5.jpeg',
    name: 'Ms. Lakshmi Prasad',
    title: 'Cultural Excellence Awardee 2023',
    nation: 'India',
    color: '#e05a24',
    quote: 'Art transcends borders, and the Global Icons Forum truly embodies that spirit. This recognition has given my work an international audience and inspired me to push the boundaries of classical Indian performing arts even further.',
  },
  {
    photo: '/news6.jpeg',
    name: 'Prof. David Kimani',
    title: 'Education Visionary Award 2023',
    nation: 'Kenya',
    color: '#5ec8e8',
    quote: 'The Global Icons Forum does not just hand out trophies — it creates a movement. Being honoured alongside leaders from across the globe reminded me why I dedicated my life to transforming education in underserved communities.',
  },
  {
    photo: '/news7.jpeg',
    name: 'Dr. Sofia Ramirez',
    title: 'Healthcare Excellence Icon 2022',
    nation: 'Colombia',
    color: '#f7c430',
    quote: 'In medicine, recognition can translate directly into resources and reach. The Global Icons Forum gave my research the international visibility it needed. Since that ceremony, three new partnerships have funded our rural healthcare programme.',
  },
  {
    photo: '/news8.jpeg',
    name: 'Mr. Hiroshi Tanaka',
    title: 'Technology Innovation Leader 2023',
    nation: 'Japan',
    color: '#e05a24',
    quote: 'I have attended many award events, but none carry the gravitas and warmth of the Global Icons Forum. The rigorous nomination process means that every person in that room has genuinely earned their place, and that makes this honour extraordinary.',
  },
  {
    photo: '/news9.jpeg',
    name: 'Ms. Fatima Al-Rashidi',
    title: 'Women Empowerment Awardee 2023',
    nation: 'UAE',
    color: '#ffffff',
    quote: 'The Forum celebrated not just my individual achievement but the thousands of women behind me whose stories I carry. It proved to me that excellence knows no geography, no gender, and no boundary — and the world is finally paying attention.',
  },
  {
    photo: '/news10.jpeg',
    name: 'Mr. Carlos Eduardo Vega',
    title: 'Social Impact Icon 2022',
    nation: 'Brazil',
    color: '#5ec8e8',
    quote: 'Walking into that hall and seeing icons from every corner of the world united by a single purpose — to celebrate excellence and drive positive change — was profoundly humbling. The Global Icons Forum is exactly the kind of institution our world needs right now.',
  },
]

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.35 } }),
}

// ---- Full screen lightbox ----
function Lightbox({ photo, name, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', cursor: 'zoom-out',
          }}
        >
          {/* Close button */}
          <button onClick={onClose} aria-label="Close"
            style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', zIndex: 2,
            }}>✕</button>

          {/* Full image */}
          <motion.img
            src={photo} alt={name}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '92vw', maxHeight: '90vh',
              objectFit: 'contain', display: 'block',
              borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              cursor: 'default',
            }}
          />

          {/* Name label */}
          {name && (
            <div style={{
              position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.35)', borderRadius: 100,
              padding: '0.5rem 1.5rem', color: '#ffffff', fontSize: '0.92rem', fontWeight: 700,
              whiteSpace: 'nowrap', letterSpacing: '0.04em',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              {name}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const imgVariants = {
  enter: (dir) => ({ opacity: 0, scale: 0.94, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  exit:  (dir) => ({ opacity: 0, scale: 0.94, x: dir > 0 ? -40 : 40, transition: { duration: 0.35 } }),
}

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [lightbox, setLightbox] = useState(null)
  const timerRef = useRef()
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: false, margin: '-80px' })

  const go = useCallback((newIndex, direction) => {
    setDir(direction)
    setIndex((newIndex + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  const next = useCallback(() => go(index + 1,  1), [index, go])
  const prev = useCallback(() => go(index - 1, -1), [index, go])

  useEffect(() => {
    if (!inView) return
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [inView, next])

  const t = TESTIMONIALS[index]

  return (
    <section ref={sectionRef} id="testimonials"
      style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid var(--color-border)', padding: '7rem 0', overflow: 'hidden' }}>
      <div className="container">

        {/* Lightbox */}
        <Lightbox
          photo={lightbox?.photo}
          name={lightbox?.name}
          onClose={() => setLightbox(null)}
        />

        {/* Heading */}
        <motion.div style={{ marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="section-label">Voices of Icons</span>
          <h2 className="section-title">What Our <span className="text-orange">Honourees</span> Say</h2>
          <div className="divider" />
        </motion.div>

        {/* Main carousel — full image left, text right */}
        <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={index} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 12px 60px rgba(0,0,0,0.28)',
              }}>

              {/* LEFT — Full photo — click to open full screen */}
              <div style={{ position: 'relative', minHeight: 460, overflow: 'hidden', cursor: 'zoom-in' }}
                onClick={() => setLightbox({ photo: t.photo, name: t.name })}>
                <img src={t.photo} alt={t.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(13,109,142,0.85) 100%)' }} />
                {/* Click hint */}
                <div style={{
                  position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.55)', borderRadius: 100, padding: '0.3rem 0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.05em', whiteSpace: 'nowrap', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  Click to view full photo
                </div>
              </div>

              {/* RIGHT — Content */}
              <div style={{
                background: 'var(--color-bg-card)',
                padding: '2.5rem',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${t.color}, transparent)` }} />

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="#f7c430" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                {/* Quote decoration */}
                <div style={{ fontFamily: 'Georgia', fontSize: '5rem', lineHeight: 0.7, color: t.color, opacity: 0.15, marginBottom: '0.5rem', userSelect: 'none' }}>&ldquo;</div>

                {/* Quote text */}
                {t.quote && (
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                )}

                {/* Name & title */}
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.35rem', lineHeight: 1.2 }}>{t.name}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: t.color, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{t.title}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {t.nation}
                </div>

                {/* Counter */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                    {index + 1} / {TESTIMONIALS.length}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {TESTIMONIALS.map((_, i) => (
                      <button key={i} onClick={() => go(i, i > index ? 1 : -1)}
                        aria-label={`Go to ${i + 1}`}
                        style={{ width: i === index ? 24 : 7, height: 7, borderRadius: 4, background: i === index ? '#e05a24' : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s ease' }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          {[{fn: prev, dir: 'prev'}, {fn: next, dir: 'next'}].map(({fn, dir: d}) => (
            <button key={d} onClick={fn} aria-label={d}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                [d === 'prev' ? 'left' : 'right']: -24,
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.25s ease', color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,90,36,0.5)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {d === 'prev' ? <path d="M19 12H5M12 19l-7-7 7-7"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
              </svg>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: 1000, margin: '1.5rem auto 0', height: 2, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div key={index} style={{ height: '100%', background: 'linear-gradient(90deg, #0f7ea3, #e05a24)', borderRadius: 2 }}
            initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5.0, ease: 'linear' }} />
        </div>

        {/* Thumbnails strip */}
        <div style={{ maxWidth: 1000, margin: '1.5rem auto 0', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {TESTIMONIALS.map((item, i) => (
            <button key={i}
              onClick={() => {
                go(i, i > index ? 1 : -1)
                setLightbox({ photo: item.photo, name: item.name })
              }}
              aria-label={`View ${item.name}`}
              style={{
                width: 72, height: 52, borderRadius: 10, overflow: 'hidden', padding: 0, border: 'none',
                cursor: 'zoom-in', opacity: i === index ? 1 : 0.45,
                outline: i === index ? '2px solid #e05a24' : 'none',
                outlineOffset: 2, transition: 'opacity 0.3s ease, outline 0.3s ease',
              }}>
              <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
