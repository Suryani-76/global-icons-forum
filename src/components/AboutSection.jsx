import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import {
  GlobalRecognitionScene, AwardsScene, CommunityScene,
  SummitScene, MediaScene, DiplomacyScene,
} from './ImpactCardScenes'

function StatNum({ end, suffix, color, label, inView }) {
  const value = useCountUp(end, 1800, inView, suffix)
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.58)', marginTop: '0.2rem' }}>{label}</div>
    </div>
  )
}

function TiltCard({ children, style = {} }) {
  const cardRef = useRef()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: dy * -7, y: dx * 7 })
  }
  return (
    <div ref={cardRef} className="wwd-card"
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovering ? 'translateY(-6px)' : ''}`, transition: hovering ? 'transform 0.08s ease' : 'transform 0.55s ease', ...style }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setHovering(true)} onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovering(false) }}
    >{children}</div>
  )
}

function CardScene({ Scene, accentColor }) {
  return (
    <div aria-hidden="true" style={{ width: 90, height: 90, borderRadius: 16, overflow: 'hidden', background: '#061e28', border: `2px solid ${accentColor}66`, flexShrink: 0, marginBottom: '1.25rem', boxShadow: `0 4px 20px ${accentColor}44` }}>
      <Canvas camera={{ position: [0, 0, 2.8], fov: 50 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]} style={{ background: 'transparent', width: '100%', height: '100%' }}>
        <Suspense fallback={null}><Scene /></Suspense>
      </Canvas>
    </div>
  )
}

const IMPACT_CARDS = [
  { accentColor: '#0f7ea3', Scene: GlobalRecognitionScene, title: 'Global Recognition', desc: 'Honoring outstanding individuals and organizations for excellence at national and international levels.' },
  { accentColor: '#f7c430', Scene: AwardsScene, title: 'Awards & Honours', desc: 'Prestigious ceremonies across continents celebrating icons in business, arts, science, diplomacy, and social impact.' },
  { accentColor: '#0f7ea3', Scene: CommunityScene, title: 'Community Building', desc: 'Fostering a global community of excellence where icons connect, collaborate, and create lasting impact.' },
  { accentColor: '#e05a24', Scene: SummitScene, title: 'Summit & Forums', desc: 'National and international conferences, seminars, summits, award ceremonies, cultural festivals and networking events.' },
  { accentColor: '#e05a24', Scene: MediaScene, title: 'Media & Spotlight', desc: 'Research, publications, media initiatives and digital platforms for knowledge sharing and global communication.' },
  { accentColor: '#0f7ea3', Scene: DiplomacyScene, title: 'Diplomacy & Peace', desc: 'Promoting ethical leadership, peace, unity, equality, and inclusive development across all communities.' },
]

const ALL_OBJECTIVES = [
  { icon: '🏆', title: 'Recognize Excellence', desc: 'Identify, recognize, and honor outstanding individuals and organizations for excellence in various fields at national and international levels.' },
  { icon: '🚀', title: 'Promote Leadership', desc: 'Promote leadership, innovation, creativity, and social responsibility across diverse sectors including education, arts, culture, media, cinema, business, healthcare, sports, technology, and public service.' },
  { icon: '🌐', title: 'International Collaboration', desc: 'Encourage international collaboration by connecting professionals, entrepreneurs, artists, researchers, and changemakers from around the world.' },
  { icon: '📅', title: 'Events & Summits', desc: 'Organize national and international conferences, seminars, summits, award ceremonies, cultural festivals, exhibitions, and networking events.' },
  { icon: '💡', title: 'Skill Development', desc: 'Support skill development, entrepreneurship, innovation, and youth empowerment through training programs, workshops, and mentorship initiatives.' },
  { icon: '🎭', title: 'Indian Heritage & Culture', desc: 'Promote Indian heritage, culture, tourism, literature, cinema, and performing arts on global platforms while encouraging cultural exchange among nations.' },
  { icon: '❤️', title: 'Social Welfare', desc: 'Undertake social welfare activities in education, healthcare, environmental protection, women empowerment, child welfare, senior citizen welfare, and community development.' },
  { icon: '📚', title: 'Research & Publications', desc: 'Encourage research, publications, media initiatives, and digital platforms for knowledge sharing and global communication.' },
  { icon: '🤝', title: 'Collaborative Partnerships', desc: 'Collaborate with government bodies, educational institutions, corporate organizations, NGOs, international agencies, and professional associations for public welfare and sustainable development.' },
  { icon: '🎓', title: 'Fellowships & Scholarships', desc: 'Institute fellowships, scholarships, recognitions, and awards for outstanding achievements and contributions to society.' },
  { icon: '⚖️', title: 'Ethical Leadership', desc: 'Promote ethical leadership, peace, unity, equality, and inclusive development across communities irrespective of caste, creed, religion, gender, or nationality.' },
  { icon: '🏢', title: 'Global Chapters', desc: 'Establish national and international chapters and representative offices to strengthen the Society\'s global outreach and impact.' },
]

const EXECUTIVE_BODY = [
  { name: 'Mr. Chaitanya Janga',        designation: 'President',       initial: 'C', color: '#e05a24', photo: '/president.jpg' },
  { name: 'Mr. Mithana Eswara Rao',     designation: 'Vice-President',  initial: 'M', color: '#ffffff', photo: '/exec-mithana.jpeg' },
  { name: 'Mrs. Jaya Pateriya',         designation: 'Secretary',       initial: 'J', color: '#ffffff', photo: '/exec-jaya-pateriya.jpeg' },
  { name: 'Mr. Kode Sri Chaitanya',     designation: 'Joint Secretary', initial: 'K', color: '#e05a24', photo: '/exec-kode-chaitanya.jpeg' },
  { name: 'Mr. Ramisetty Venkata Apparao', designation: 'Treasurer',    initial: 'R', color: '#ffffff', photo: '/exec-ramisetty.jpeg', facePos: 'center 22%' },
  { name: 'Dr. Animelli Naveen',         designation: 'Member',         initial: 'A', color: '#e05a24', photo: '/exec-animelli-naveen.jpeg' },
  { name: 'Mr. Battula Dhanista',        designation: 'Member',         initial: 'B', color: '#ffffff', photo: '/exec-battula.jpeg' },
  { name: 'Mr. Emmanuel',               designation: 'Member',          initial: 'E', color: '#ffffff', photo: '/exec-emmanuel.jpeg' },
  { name: 'Mr. Syed Ghouseuddin',       designation: 'Member',          initial: 'S', color: '#e05a24', photo: '/exec-syed.jpeg' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] } }),
}

export default function AboutSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div ref={sectionRef}>

      {/* ===== HERO INTRO ===== */}
      <section className="section whatwedo" style={{ background: 'var(--color-bg-card)', paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', marginBottom: '4rem' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">A Society Built on <span className="text-orange">Excellence</span></h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                The Global Icons Forum Society is a registered non-profit organisation dedicated to identifying, celebrating, and connecting extraordinary individuals who have demonstrated exceptional leadership, innovation, and impact on a global scale.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.72)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Registered under the Societies Registration Act 35/2001, founded on the principles of integrity, excellence, and global unity — operating with no profit motive, no commercial activity.
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { end: 120, suffix: '+', label: 'Nations',              color: '#ffffff' },
                  { end: 50,  suffix: '+', label: 'Award Categories',     color: '#e05a24' },
                  { end: 200, suffix: '+', label: 'Partner Organisations', color: '#ffffff' },
                  { end: 12,  suffix: '',  label: 'Core Objectives',       color: '#e05a24' },
                ].map((s, i) => <StatNum key={i} {...s} inView={inView} />)}
              </div>
            </motion.div>

            {/* President + Secretary photos */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>

              {/* Mr. Chaitanya Janga */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: 24, background: 'linear-gradient(135deg, rgba(224,90,36,0.5), rgba(15,126,163,0.5))', filter: 'blur(14px)', zIndex: 0 }} />
                  <img src="/president.jpg" alt="Mr. Chaitanya Janga"
                    style={{ width: 'clamp(150px, 18vw, 220px)', height: 'auto', display: 'block', borderRadius: 20, position: 'relative', zIndex: 1, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '3px solid rgba(15,126,163,0.2)' }} />
                </motion.div>
                <div style={{
                  background: 'linear-gradient(135deg, #b94000 0%, #e05a24 50%, #ff8c55 100%)',
                  borderRadius: 14,
                  padding: '0.75rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 6px 28px rgba(224,90,36,0.55), 0 1px 0 rgba(255,255,255,0.15) inset',
                  border: 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', color: '#ffffff', letterSpacing: '0.02em' }}>Mr. Chaitanya Janga</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.25rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>✦ President ✦</div>
                </div>
              </div>

              {/* Mrs. Jaya Pateriya */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 0.5 }} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: 24, background: 'linear-gradient(135deg, rgba(15,126,163,0.5), rgba(224,90,36,0.5))', filter: 'blur(14px)', zIndex: 0 }} />
                  <img src="/exec-jaya-pateriya.jpeg" alt="Mrs. Jaya Pateriya"
                    style={{ width: 'clamp(150px, 18vw, 220px)', height: 'auto', display: 'block', borderRadius: 20, position: 'relative', zIndex: 1, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '3px solid rgba(224,90,36,0.2)' }} />
                </motion.div>
                <div style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4a 50%, #3a3a6a 100%)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: '0.75rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 6px 28px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1) inset',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', color: '#ffffff', letterSpacing: '0.02em' }}>Mrs. Jaya Pateriya</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>✦ Secretary ✦</div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ALL 12 AIMS & OBJECTIVES ===== */}
      <section className="section" style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Memorandum of Association</span>
            <h2 className="section-title">Our <span className="text-orange">Aims & Objectives</span></h2>
            <div className="divider" />
            <p className="section-subtitle">All 12 core objectives as laid out in the official Memorandum of Association, registered under the Societies Registration Act 35/2001.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {ALL_OBJECTIVES.map((obj, i) => (
              <motion.div key={i} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={i}
                style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1 }}>{obj.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '0.15rem 0.5rem' }}>{i + 1}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{obj.title}</div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0 }}>{obj.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AREAS OF IMPACT (6 cards with 3D) ===== */}
      <section className="section whatwedo" style={{ background: 'var(--color-bg-card)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '0.5rem' }}>
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Our Areas of <span className="text-orange">Impact</span></h2>
            <div className="divider" />
          </motion.div>
          <div className="whatwedo-grid">
            {IMPACT_CARDS.map((item, i) => (
              <motion.div key={i} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={i}>
                <TiltCard>
                  <CardScene Scene={item.Scene} accentColor={item.accentColor} />
                  <div style={{ width: 36, height: 2.5, borderRadius: 2, background: item.accentColor, marginBottom: '0.85rem', opacity: 0.7 }} />
                  <div className="wwd-title">{item.title}</div>
                  <p className="wwd-desc">{item.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXECUTIVE BODY ===== */}
      <section className="section" id="team" style={{ background: 'var(--color-bg-mid)', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Executive <span className="text-orange">Body</span></h2>
            <div className="divider" />
            <p className="section-subtitle">The governing committee of the Global Icons Forum Society, duly registered under the Societies Registration Act 35/2001.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {EXECUTIVE_BODY.map((member, i) => (
              <motion.div key={i} variants={cardVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={i}
                style={{ background: 'var(--color-bg-card)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', padding: '2rem 1.25rem 1.5rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', position: 'relative', overflow: 'hidden' }}>
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #e05a24, transparent)' }} />
                {/* Avatar — big square */}
                <div style={{ width: 150, height: 150, borderRadius: 18, margin: '0 auto 1.25rem', overflow: 'hidden', border: '3px solid rgba(224,90,36,0.5)', boxShadow: '0 6px 24px rgba(224,90,36,0.25)' }}>
                  {member.photo ? (
                    <img src={member.photo} alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: member.facePos || 'center top', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '3rem', color: '#fff' }}>
                      {member.initial}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.45rem', lineHeight: 1.3 }}>{member.name}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e05a24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{member.designation}</div>
              </motion.div>
            ))}
          </div>

          {/* Registered details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
            style={{ marginTop: '3rem', background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', padding: '1.75rem 2rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'Registered Under', value: 'Societies Registration Act 35/2001' },
              { label: 'Registered Office', value: 'Global Icons Forum Society, 24-29-211, Durga Puram, Gulabi Thota Road, J Apparao Street, Vijayawada 520003, Andhra Pradesh' },
              { label: 'Nature', value: 'Non-Profit · No Commercial Activity' },
              { label: 'Financial Year', value: 'April 1st — March 31st' },
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: '3px solid rgba(255,255,255,0.6)', paddingLeft: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>{item.value}</div>
              </div>
            ))}
          </motion.div>

          {/* ISO 9001:2015 Certification Highlight */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.75 }}
            style={{
              marginTop: '2rem',
              background: 'linear-gradient(135deg, rgba(247,196,48,0.18) 0%, rgba(200,150,58,0.1) 100%)',
              borderRadius: 16, border: '1.5px solid rgba(247,196,48,0.5)',
              padding: '1.75rem 2rem',
              boxShadow: '0 4px 32px rgba(247,196,48,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
            {/* Gold shimmer top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #f7c430, transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f7c430, #c8963a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', boxShadow: '0 0 24px rgba(247,196,48,0.5)', flexShrink: 0,
                }}>🏅</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#f7c430', lineHeight: 1 }}>ISO 9001:2015</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: '0.2rem' }}>Quality Management System — Certified</div>
                </div>
              </div>

              <div style={{ width: 1, height: 48, background: 'rgba(247,196,48,0.35)', flexShrink: 0 }} />

              {/* Details grid */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', flex: 1 }}>
                {[
                  { label: 'Certificate No.', value: 'QMS/26M05315' },
                  { label: 'Certified by', value: 'MQA Certification Services' },
                  { label: 'Location', value: '130 Thessaly Rd, Nine Elms, London SW8 5EJ, UK' },
                  { label: 'Initial Registration', value: '18 July 2026' },
                  { label: 'Re-certification Due', value: '17 July 2029' },
                  { label: 'Accreditation', value: 'UKAF-CB-011 · UKAF CERT LIMITED' },
                ].map((item, i) => (
                  <div key={i} style={{ minWidth: 160 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(247,196,48,0.75)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Scope text */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(247,196,48,0.25)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(247,196,48,0.75)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certified Scope: </span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                  To identify, recognize, and honor outstanding individuals and organizations for excellence in various fields at national and international levels.
                </span>
              </div>

              {/* View Certificate Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href="/iso-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'linear-gradient(135deg, #f7c430, #c8963a)',
                    color: '#1a0e00', fontFamily: 'var(--font-body)',
                    fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em',
                    textDecoration: 'none', borderRadius: 8,
                    padding: '0.6rem 1.4rem',
                    boxShadow: '0 4px 16px rgba(247,196,48,0.4)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  View Certificate
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
