import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useAnnouncements } from '../../utils/announcementsStore'

export default function AnnouncementsManager() {
  const [data, setData]         = useAnnouncements()
  const [editHero, setEditHero] = useState(false)
  const [heroTemp, setHeroTemp] = useState(data.hero)
  const [newBanner, setNewBanner] = useState('')
  const [bannerAccent, setBannerAccent] = useState('orange')
  const [partnerModal, setPartnerModal] = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const saveHero = () => {
    const tagline = heroTemp?.tagline ?? document.querySelector('#hero-tagline-input')?.value ?? ''
    const subtext = heroTemp?.subtext ?? document.querySelector('#hero-subtext-input')?.value ?? ''
    setData(prev => ({ ...prev, hero: { tagline, subtext } }))
    setEditHero(false)
    showToast('✓ Hero section updated on live website.')
  }

  const addBanner = () => {
    const text = newBanner.trim() || document.querySelector('#new-banner-input')?.value?.trim() || ''
    if (!text) return
    const banner = {
      id: Date.now(),
      text,
      accent: bannerAccent,
      active: true,
    }
    setData(prev => ({
      ...prev,
      banners: [banner, ...(prev.banners || [])],
    }))
    setNewBanner('')
    showToast('✓ Ticker banner added to live site.')
  }

  const toggleBanner = (id) => {
    setData(prev => ({
      ...prev,
      banners: (prev.banners || []).map(b => b.id === id ? { ...b, active: !b.active } : b),
    }))
    showToast('Banner visibility toggled.')
  }

  const removeBanner = (id) => {
    setData(prev => ({
      ...prev,
      banners: (prev.banners || []).filter(b => b.id !== id),
    }))
    showToast('Banner removed.')
  }

  const savePartner = () => {
    if (!partnerModal?.data?.name?.trim()) return
    if (partnerModal.mode === 'add') {
      setData(prev => ({
        ...prev,
        partners: [...(prev.partners || []), { ...partnerModal.data, id: Date.now() }],
      }))
      showToast('✓ Partner added to live site.')
    } else {
      setData(prev => ({
        ...prev,
        partners: (prev.partners || []).map(p => p.id === partnerModal.data.id ? partnerModal.data : p),
      }))
      showToast('✓ Partner updated.')
    }
    setPartnerModal(null)
  }

  const removePartner = (id) => {
    setData(prev => ({
      ...prev,
      partners: (prev.partners || []).filter(p => p.id !== id),
    }))
    showToast('Partner removed.')
  }

  return (
    <div>
      <PageHeader title="Homepage & Announcements" subtitle="Hero text, marquee ticker, partners live sync" />
      {toast && <Toast msg={toast} />}

      {/* HERO SECTION */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>🎯 Homepage Hero Text</div>
          <Btn id="edit-hero-btn" size="sm" onClick={() => { setHeroTemp(data.hero || {}); setEditHero(true) }}>✏️ Edit</Btn>
        </div>
        {editHero ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Tagline / Header</label>
              <input
                id="hero-tagline-input"
                value={heroTemp?.tagline || ''}
                onChange={e => setHeroTemp(p => ({ ...p, tagline: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Subtitle / Paragraph</label>
              <textarea
                id="hero-subtext-input"
                value={heroTemp?.subtext || ''}
                onChange={e => setHeroTemp(p => ({ ...p, subtext: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Btn id="save-hero-btn" onClick={saveHero}>Save & Update Live Site</Btn>
              <Btn variant="ghost" onClick={() => setEditHero(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e05a24', marginBottom: '0.4rem' }}>
              {data.hero?.tagline}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {data.hero?.subtext}
            </p>
          </div>
        )}
      </Card>

      {/* MARQUEE TICKER BANNERS */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>
          📣 Marquee Ticker Announcements ({data.banners?.length || 0})
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            id="new-banner-input"
            value={newBanner}
            onChange={e => setNewBanner(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addBanner()}
            placeholder="Add new scrolling announcement ticker item..."
            style={{ ...inputStyle, flex: 1, minWidth: 260 }}
          />
          <select
            id="banner-accent-select"
            value={bannerAccent}
            onChange={e => setBannerAccent(e.target.value)}
            style={{ ...inputStyle, width: 'auto' }}
          >
            <option value="orange">Orange Dot</option>
            <option value="blue">Blue Dot</option>
          </select>
          <Btn id="add-banner-btn" onClick={addBanner}>+ Add to Ticker</Btn>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(data.banners || []).map(b => (
            <div
              key={b.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.65rem 0.9rem', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                  background: b.accent === 'blue' ? '#0f7ea3' : '#e05a24',
                }} />
                <span style={{ fontSize: '0.85rem', color: b.active ? '#fff' : 'rgba(255,255,255,0.35)', textDecoration: b.active ? 'none' : 'line-through' }}>
                  {b.text}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Btn size="sm" variant="ghost" onClick={() => toggleBanner(b.id)}>
                  {b.active ? 'Hide' : 'Show'}
                </Btn>
                <Btn size="sm" variant="ghost" onClick={() => removeBanner(b.id)} style={{ color: '#ff6b6b' }}>
                  🗑
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* PARTNERS & AFFILIATIONS */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
            🤝 Partner Organisations & Affiliations
          </div>
          <Btn size="sm" onClick={() => setPartnerModal({ mode: 'add', data: { name: '', active: true } })}>
            + Add Partner
          </Btn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {(data.partners || []).map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{p.name}</span>
              <Btn size="sm" variant="ghost" onClick={() => removePartner(p.id)} style={{ color: '#ff6b6b' }}>🗑</Btn>
            </div>
          ))}
        </div>
      </Card>

      {/* Partner Modal */}
      {partnerModal && (
        <div style={overlayStyle} onClick={() => setPartnerModal(null)}>
          <div style={{ ...modalStyle, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>Add Partner</span>
              <button type="button" onClick={() => setPartnerModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Partner Organisation Name</label>
              <input
                value={partnerModal.data.name}
                onChange={e => setPartnerModal(p => ({ ...p, data: { ...p.data, name: e.target.value } }))}
                style={inputStyle}
                placeholder="e.g. Ministry of Culture, India"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={savePartner} style={primaryBtn}>Save Partner</button>
              <button type="button" onClick={() => setPartnerModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Toast({ msg }) {
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      background: '#2ecc71', color: '#fff', padding: '0.75rem 1.25rem',
      borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      {msg}
    </div>
  )
}

const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
}
const modalStyle = {
  width: '100%', background: '#111c26',
  borderRadius: 16, padding: '2rem',
  boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
  border: '1px solid rgba(255,255,255,0.1)',
}
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }
const modalTitle  = { fontSize: '1rem', fontWeight: 700, color: '#fff' }
const closeBtn    = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }
const labelStyle  = { display: 'block', fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '0.35rem' }
const inputStyle  = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box',
}
const primaryBtn  = { background: '#e05a24', color: '#fff', border: 'none', borderRadius: 8, padding: '0.65rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn    = { background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', borderRadius: 8, padding: '0.65rem 1.25rem', fontSize: '0.85rem', cursor: 'pointer' }
