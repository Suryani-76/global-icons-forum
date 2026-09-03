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

const isLowPower =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency <= 2 || /Android|iPhone|iPad/i.test(navigator.userAgent))

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
const PATH_TO_TAB = Object.fromEntries(Object.entries(TAB_TO_PATH).map(([k, v]) => [v, k]))

function getInitialTab() {
  const path = window.location.pathname
  return PATH_TO_TAB[path] || 'home'
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
