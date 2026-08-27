import { useState } from 'react'
import GalleryManager       from './sections/GalleryManager'
import ExecutiveManager     from './sections/ExecutiveManager'
import TestimonialsManager  from './sections/TestimonialsManager'
import NewsManager          from './sections/NewsManager'
import AwardsManager        from './sections/AwardsManager'
import NominationsManager   from './sections/NominationsManager'
import MembersManager       from './sections/MembersManager'
import AnnouncementsManager from './sections/AnnouncementsManager'
import NewspaperManager    from './sections/NewspaperManager'
import SettingsManager      from './sections/SettingsManager'

// Clean SVG icons — no emojis
const Icons = {
  gallery:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  executive:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  testimonials:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  news:          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  awards:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  nominations:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  members:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  announcements: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  newspaper:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  settings:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  menu:          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  globe:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
}

const NAV = [
  { id: 'gallery',       label: 'Gallery',            group: 'Content' },
  { id: 'executive',     label: 'Executive Body',     group: 'Content' },
  { id: 'testimonials',  label: 'Testimonials',       group: 'Content' },
  { id: 'news',          label: 'News & Events',      group: 'Content' },
  { id: 'awards',        label: 'Awards',             group: 'Content' },
  { id: 'nominations',   label: 'Nominations',        group: 'Applications' },
  { id: 'members',       label: 'Members & Chapters', group: 'Applications' },
  { id: 'announcements', label: 'Announcements',      group: 'Homepage' },
  { id: 'newspaper',    label: 'Newspaper',           group: 'Homepage' },
  { id: 'settings',      label: 'Settings',           group: 'Settings' },
]

const SECTION_MAP = {
  gallery:       GalleryManager,
  executive:     ExecutiveManager,
  testimonials:  TestimonialsManager,
  news:          NewsManager,
  awards:        AwardsManager,
  nominations:   NominationsManager,
  members:       MembersManager,
  announcements: AnnouncementsManager,
  newspaper:     NewspaperManager,
  settings:      SettingsManager,
}

export default function AdminLayout({ onLogout }) {
  const [active, setActive] = useState('gallery')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const ActiveSection = SECTION_MAP[active]
  const groups = [...new Set(NAV.map(n => n.group))]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1e28', fontFamily: 'var(--font-body)' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0,
        background: 'linear-gradient(180deg, #0c1a26 0%, #0a1520 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
        position: 'sticky', top: 0, height: '100vh',
        boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
      }}>
        {/* Brand */}
        <div style={{
          padding: sidebarOpen ? '1.5rem 1.25rem 1.25rem' : '1.5rem 0 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: 72, justifyContent: sidebarOpen ? 'flex-start' : 'center',
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src="/logo.png" alt="GIF" style={{ width: 38, height: 38, borderRadius: 10, display: 'block' }} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#2ecc71', border: '2px solid #0c1a26' }} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '0.01em' }}>GIF Admin</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.15rem' }}>Global Icons Forum</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {groups.map((group, gi) => (
            <div key={group} style={{ marginBottom: '0.25rem' }}>
              {sidebarOpen && (
                <div style={{
                  padding: gi === 0 ? '0 0.5rem 0.5rem' : '1rem 0.5rem 0.5rem',
                  fontSize: '0.6rem', fontWeight: 700,
                  color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>
                  {group}
                </div>
              )}
              {!sidebarOpen && gi > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0.75rem' }} />}
              {NAV.filter(n => n.group === group).map(item => {
                const isActive = active === item.id
                return (
                  <button key={item.id} onClick={() => setActive(item.id)}
                    title={!sidebarOpen ? item.label : ''}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: '0.75rem',
                      padding: sidebarOpen ? '0.65rem 0.75rem' : '0.7rem 0',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      borderRadius: 10, border: 'none', cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(224,90,36,0.18) 0%, rgba(224,90,36,0.06) 100%)'
                        : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                      boxShadow: isActive ? 'inset 0 0 0 1px rgba(224,90,36,0.25)' : 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                      }
                    }}
                  >
                    {/* Active indicator pill */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: '20%', bottom: '20%',
                        width: 3, borderRadius: '0 3px 3px 0',
                        background: 'linear-gradient(180deg, #ff7a45, #e05a24)',
                        boxShadow: '0 0 8px rgba(224,90,36,0.6)',
                      }} />
                    )}
                    <span style={{
                      flexShrink: 0, display: 'flex', alignItems: 'center',
                      color: isActive ? '#e05a24' : 'inherit',
                      filter: isActive ? 'drop-shadow(0 0 4px rgba(224,90,36,0.5))' : 'none',
                    }}>
                      {Icons[item.id]}
                    </span>
                    {sidebarOpen && (
                      <span style={{ fontSize: '0.84rem', fontWeight: isActive ? 600 : 400, letterSpacing: '0.01em' }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onLogout}
            style={{
              width: '100%', padding: sidebarOpen ? '0.65rem 0.75rem' : '0.65rem 0',
              borderRadius: 10, background: 'transparent',
              border: '1px solid rgba(255,60,60,0.15)',
              color: 'rgba(255,120,120,0.55)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '0.6rem',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,60,60,0.1)'
              e.currentTarget.style.color = '#ff8080'
              e.currentTarget.style.borderColor = 'rgba(255,60,60,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255,120,120,0.55)'
              e.currentTarget.style.borderColor = 'rgba(255,60,60,0.15)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.logout}</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 60, 
          background: 'linear-gradient(90deg, #0c1a26 0%, #0e1e2c 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 1.75rem', gap: '1rem',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
        }}>
          <button onClick={() => setSidebarOpen(s => !s)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', borderRadius: 6, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            {Icons.menu}
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
              {NAV.find(n => n.id === active)?.label}
            </span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            {Icons.globe} View Site
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #e05a24, #ff8c55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', boxShadow: '0 2px 8px rgba(224,90,36,0.4)' }}>A</div>
            {sidebarOpen && <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Admin</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>Super Admin</div>
            </div>}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
