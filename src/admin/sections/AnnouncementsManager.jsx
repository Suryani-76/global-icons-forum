import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const INIT_HERO = { tagline: 'Celebrating Excellence Across the Globe', subtext: 'The Global Icons Forum Society honours outstanding individuals and organisations for excellence at national and international levels.' }
const INIT_BANNERS = [
  { id: 1, text: '🏆 Nominations Open for Global Icons Awards 2026 — Apply Now', active: true },
  { id: 2, text: '📅 National Summit 2026 — Coming September, Vijayawada', active: true },
  { id: 3, text: '🌐 ISO 9001:2015 Certified — MQA Certification Services, UK', active: false },
]
const INIT_PARTNERS = [
  { id: 1, name: 'Ministry of Culture, India',   logo: '', url: '#', active: true },
  { id: 2, name: 'UKAF Certification Limited',   logo: '', url: '#', active: true },
  { id: 3, name: 'MQA Certification Services',   logo: '', url: '#', active: true },
  { id: 4, name: 'Andhra Pradesh Tourism',        logo: '', url: '#', active: false },
]

export default function AnnouncementsManager() {
  const [hero, setHero]         = useState(INIT_HERO)
  const [editHero, setEditHero] = useState(false)
  const [heroTemp, setHeroTemp] = useState(INIT_HERO)
  const [banners, setBanners]   = useState(INIT_BANNERS)
  const [newBanner, setNewBanner] = useState('')
  const [partners, setPartners] = useState(INIT_PARTNERS)
  const [partnerModal, setPartnerModal] = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const saveHero = () => { setHero(heroTemp); setEditHero(false); showToast('Hero section updated.') }
  const addBanner = () => {
    if (!newBanner.trim()) return
    setBanners(prev => [...prev, { id: Date.now(), text: newBanner.trim(), active: true }])
    setNewBanner(''); showToast('Banner added.')
  }
  const toggleBanner = (id) => setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  const removeBanner = (id) => { setBanners(prev => prev.filter(b => b.id !== id)); showToast('Banner removed.') }

  const savePartner = () => {
    if (!partnerModal.data.name.trim()) return
    if (partnerModal.mode === 'add') { setPartners(prev => [...prev, partnerModal.data]); showToast('Partner added.') }
    else                             { setPartners(prev => prev.map(p => p.id === partnerModal.data.id ? partnerModal.data : p)); showToast('Updated.') }
    setPartnerModal(null)
  }

  return (
    <div>
      <PageHeader title="Homepage & Announcements" subtitle="Hero text, banners, partners" />
      {toast && <Toast msg={toast} />}

      {/* HERO SECTION */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>🎯 Hero Section Text</div>
          <Btn size="sm" onClick={() => { setHeroTemp(hero); setEditHero(true) }}>✏️ Edit</Btn>
        </div>
        {editHero ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><label style={labelStyle}>Tagline</label><input value={heroTemp.tagline} onChange={e => setHeroTemp(p => ({ ...p, tagline: e.target.value }))} style={inputStyle} /></div>
            <div><label style={labelStyle}>Subtitle</label><textarea value={heroTemp.subtext} onChange={e => setHeroTemp(p => ({ ...p, subtext: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div style={{ display: 'flex', gap: '0.75rem' }}><Btn onClick={saveHero}>Save</Btn><Btn variant="ghost" onClick={() => setEditHero(false)}>Cancel</Btn></div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><span style={labelStyle}>Tagline</span><div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{hero.tagline}</div></div>
            <div><span style={labelStyle}>Subtitle</span><div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{hero.subtext}</div></div>
          </div>
        )}
      </Card>

      {/* BANNERS */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>📣 Announcement Banners</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input value={newBanner} onChange={e => setNewBanner(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBanner()} placeholder="New banner text..." style={{ ...inputStyle, flex: 1 }} />
          <Btn onClick={addBanner}>Add</Btn>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {banners.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
              <div style={{ flex: 1, fontSize: '0.82rem', color: b.active ? '#fff' : 'rgba(255,255,255,0.35)' }}>{b.text}</div>
              <Badge color={b.active ? '#2ecc71' : '#666'}>{b.active ? 'Live' : 'Off'}</Badge>
              <Btn size="sm" variant="ghost" onClick={() => toggleBanner(b.id)}>{b.active ? 'Hide' : 'Show'}</Btn>
              <Btn size="sm" variant="danger" onClick={() => removeBanner(b.id)}>✕</Btn>
            </div>
          ))}
        </div>
      </Card>

      {/* PARTNERS */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>🤝 Partner / Collaboration Logos</div>
          <Btn size="sm" onClick={() => setPartnerModal({ mode: 'add', data: { id: Date.now(), name: '', logo: '', url: '#', active: true } })}>+ Add</Btn>
        </div>

        {partnerModal && (
          <div style={overlayStyle}>
            <Card style={{ maxWidth: 420, width: '100%' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>{partnerModal.mode === 'add' ? 'Add Partner' : 'Edit Partner'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[['Organisation Name', 'name'], ['Logo URL', 'logo'], ['Website URL', 'url']].map(([label, key]) => (
                  <div key={key}><label style={labelStyle}>{label}</label><input value={partnerModal.data[key]} onChange={e => setPartnerModal(p => ({ ...p, data: { ...p.data, [key]: e.target.value } }))} style={inputStyle} /></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <Btn onClick={savePartner}>Save</Btn>
                <Btn variant="ghost" onClick={() => setPartnerModal(null)}>Cancel</Btn>
              </div>
            </Card>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {partners.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.6rem' }}>{p.url}</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Badge color={p.active ? '#2ecc71' : '#666'}>{p.active ? 'Active' : 'Hidden'}</Badge>
                <Btn size="sm" onClick={() => setPartnerModal({ mode: 'edit', data: { ...p } })}>✏️</Btn>
                <Btn size="sm" variant="ghost" onClick={() => setPartners(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))}>{p.active ? 'Hide' : 'Show'}</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
