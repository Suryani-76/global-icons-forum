import { Suspense, useState, lazy, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionLoader } from './components/CanvasLoader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MarqueeTicker from './components/MarqueeTicker'
import IsoBanner from './components/IsoBanner'
import './styles/global.css'
import './styles/components.css'

const AboutSection        = lazy(() => import('./components/AboutSection'))
const AwardsSection       = lazy(() => import('./components/AwardsSection'))
const GallerySection      = lazy(() => import('./components/GallerySection'))
const TestimonialCarousel = lazy(() => import('./components/TestimonialCarousel'))
const ContactSection      = lazy(() => import('./components/ContactSection'))
const FooterSection       = lazy(() => import('./components/FooterSection'))
const MembershipSection   = lazy(() => import('./components/MembershipSection'))
const ProgrammesSection   = lazy(() => import('./components/ProgrammesSection'))
const ChaptersSection     = lazy(() => import('./components/ChaptersSection'))
const EventsSection       = lazy(() => import('./components/EventsSection'))
const NewsletterSection   = lazy(() => import('./components/NewsletterSection'))
const LegalSection        = lazy(() => import('./components/LegalSection'))
const CollaborationSection = lazy(() => import('./components/CollaborationSection'))
const AmbientParticles    = lazy(() => import('./components/AmbientParticles'))

const hasWebGL = typeof window !== 'undefined' && (() => {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    return false
  }
})()

const isLowPower =
  !hasWebGL ||
  (typeof navigator !== 'undefined' &&
    (navigator.hardwareConcurrency <= 2 || /Android|iPhone|iPad/i.test(navigator.userAgent)))

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22 } },
}

const Loader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <SectionLoader />
  </div>
)

function TabContent({ tab, onTabChange }) {
  const wrap = (Component) => (
    <Suspense fallback={<Loader />}>
      <Component onTabChange={onTabChange} />
    </Suspense>
  )
  switch (tab) {
    case 'home':         return <><HeroSection onTabChange={onTabChange} /><MarqueeTicker direction="left" /></>
    case 'about':        return wrap(AboutSection)
    case 'awards':       return wrap(AwardsSection)
    case 'gallery':      return wrap(GallerySection)
    case 'testimonials': return wrap(TestimonialCarousel)
    case 'membership':   return wrap(MembershipSection)
    case 'programmes':   return wrap(ProgrammesSection)
    case 'chapters':     return wrap(ChaptersSection)
    case 'events':       return wrap(EventsSection)
    case 'newsletter':   return wrap(NewsletterSection)
    case 'legal':        return wrap(LegalSection)
    case 'partners':     return wrap(CollaborationSection)
    case 'contact':      return wrap(ContactSection)
    default:             return null
  }
}

// Map tab ids to URL paths and back
const TAB_TO_PATH = {
  home:         '/',
  about:        '/about',
  awards:       '/awards',
  gallery:      '/gallery',
  testimonials: '/testimonials',
  membership:   '/membership',
  programmes:   '/programmes',
  chapters:     '/chapters',
  events:       '/events',
  newsletter:   '/newsletter',
  legal:        '/legal',
  partners:     '/partners',
  contact:      '/contact',
}
const PATH_TO_TAB = {
  ...Object.fromEntries(Object.entries(TAB_TO_PATH).map(([k, v]) => [v, k])),
  '/news': 'newsletter',
}

function getInitialTab() {
  const path = window.location.pathname
  return PATH_TO_TAB[path] || 'home'
}

const SEO_META = {
  home: {
    title: 'Global Icons Forum Society — Celebrating Excellence, Inspiring Leadership',
    description: 'A prestigious international non-profit society recognising extraordinary individuals and organisations driving positive global change across 120+ countries. ISO 9001:2015 Certified.',
  },
  about: {
    title: 'About Us & Executive Body | Global Icons Forum Society',
    description: 'Discover the history, objectives, registration under Societies Registration Act 35/2001, and governing committee of Global Icons Forum Society.',
  },
  awards: {
    title: 'Prestigious Awards & Honours | Global Icons Forum Society',
    description: 'Explore the Global Icon of the Year, Excellence in Innovation, Peace & Diplomacy, and other prestigious international honours.',
  },
  events: {
    title: 'News & Events Archive | Global Icons Forum Society',
    description: 'Latest events, summits, State Icons Awards Night, Super Star Krishna Awards, and official society announcements.',
  },
  gallery: {
    title: 'Photo Gallery — Moments of Excellence | Global Icons Forum Society',
    description: 'Browse the complete high-resolution photo gallery of Global Icons Forum award ceremonies, summits, and felicitation events.',
  },
  testimonials: {
    title: 'Honouree Testimonials & Global Feedback | Global Icons Forum Society',
    description: 'Read inspiring testimonials and feedback from distinguished dignitaries, award recipients, and international delegates.',
  },
  membership: {
    title: 'Join the Society — Membership Categories | Global Icons Forum Society',
    description: 'Become a General, Life, or Patron member of the Global Icons Forum Society. Unlock international networking and fellowship opportunities.',
  },
  programmes: {
    title: 'Programmes & Social Initiatives | Global Icons Forum Society',
    description: 'Learn about our fellowships, youth empowerment, healthcare camps, education drives, and community upliftment programmes.',
  },
  chapters: {
    title: 'National & International Chapters | Global Icons Forum Society',
    description: 'Our presence across Vijayawada, Hyderabad, Mumbai, Bengaluru, Delhi, London, New York, and 120+ countries worldwide.',
  },
  newsletter: {
    title: 'Newspaper & Media Coverage | Global Icons Forum Society',
    description: 'Extensive press coverage, media clippings, and featured newspaper articles covering Global Icons Forum initiatives.',
  },
  partners: {
    title: 'Collaboration & Global Partners | Global Icons Forum Society',
    description: 'Partner with the Global Icons Forum Society across government bodies, universities, corporate CSR, and social organisations.',
  },
  legal: {
    title: 'Legal Governance & Bylaws | Global Icons Forum Society',
    description: 'Official registration under Societies Registration Act 35/2001, non-profit status, constitutional bylaws, and audited governance.',
  },
  contact: {
    title: 'Contact Us | Global Icons Forum Society',
    description: 'Get in touch with our registered office in Vijayawada or operating office in Hyderabad. Submit nominations and general enquiries.',
  },
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab)

  const handleTabChange = (id) => {
    setActiveTab(id)
    const path = TAB_TO_PATH[id] || '/'
    window.history.pushState({ tab: id }, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPop = (e) => {
      const tab = e.state?.tab || PATH_TO_TAB[window.location.pathname] || 'home'
      setActiveTab(tab)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Dynamic SEO meta updates on route / tab change
  useEffect(() => {
    const meta = SEO_META[activeTab] || SEO_META.home
    document.title = meta.title

    let descTag = document.querySelector('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.name = 'description'
      document.head.appendChild(descTag)
    }
    descTag.content = meta.description

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.content = meta.title
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.content = meta.description

    const path = TAB_TO_PATH[activeTab] || '/'
    const fullUrl = `https://globaliconsforumsociety.org${path}`
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.href = fullUrl
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.content = fullUrl
  }, [activeTab])

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Custom cursor disabled — using normal cursor */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      {/* ISO 9001:2015 Banner — shown on every page below navbar */}
      <div style={{ paddingTop: '72px' }}>
        <IsoBanner />
      </div>
      <main style={{ minHeight: 'calc(100vh - 72px)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <TabContent tab={activeTab} onTabChange={handleTabChange} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Suspense fallback={<div style={{ minHeight: '20vh', background: '#0a0a0a' }} />}>
        <FooterSection onTabChange={handleTabChange} />
      </Suspense>
      {!isLowPower && (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 14], fov: 55 }} gl={{ antialias: false, alpha: true }} dpr={1}
            style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }} frameloop="always">
            <Suspense fallback={null}><AmbientParticles count={55} /></Suspense>
          </Canvas>
        </div>
      )}
    </div>
  )
}
