import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const INIT = [
  { id: 1,  photo: '/news1.jpeg',  name: 'Dr. Priya Sharma',            title: 'Global Innovator of the Year 2023',  nation: 'India',     quote: 'Being recognised by the Global Icons Forum was a watershed moment in my career.' },
  { id: 2,  photo: '/news2.jpeg',  name: 'Ambassador Jean-Paul Moreau', title: 'Peace & Diplomacy Awardee 2022',     nation: 'France',    quote: 'The Global Icons Forum stands as a rare institution that genuinely bridges cultures and continents.' },
  { id: 3,  photo: '/news3.jpeg',  name: 'Ms. Amara Osei',              title: 'Humanitarian Leadership Award 2023', nation: 'Ghana',     quote: 'Receiving this award on behalf of thousands of women I work with across West Africa was deeply moving.' },
  { id: 4,  photo: '/news4.jpeg',  name: 'Mr. Rajan Mehta',             title: 'Business Icon of the Decade 2021',  nation: 'Singapore', quote: 'What sets the Global Icons Forum apart is the quality of the community it has built.' },
  { id: 5,  photo: '/news5.jpeg',  name: 'Ms. Lakshmi Prasad',          title: 'Cultural Excellence Awardee 2023',  nation: 'India',     quote: 'Art transcends borders, and the Global Icons Forum truly embodies that spirit.' },
  { id: 6,  photo: '/news6.jpeg',  name: 'Prof. David Kimani',          title: 'Education Visionary Award 2023',    nation: 'Kenya',     quote: 'The Global Icons Forum does not just hand out trophies — it creates a movement.' },
  { id: 7,  photo: '/news7.jpeg',  name: 'Dr. Sofia Ramirez',           title: 'Healthcare Excellence Icon 2022',   nation: 'Colombia',  quote: 'The Global Icons Forum gave my research the international visibility it needed.' },
  { id: 8,  photo: '/news8.jpeg',  name: 'Mr. Hiroshi Tanaka',          title: 'Technology Innovation Leader 2023', nation: 'Japan',     quote: 'None carry the gravitas and warmth of the Global Icons Forum.' },
  { id: 9,  photo: '/news9.jpeg',  name: 'Ms. Fatima Al-Rashidi',       title: 'Women Empowerment Awardee 2023',    nation: 'UAE',       quote: 'Excellence knows no geography, no gender, and no boundary.' },
  { id: 10, photo: '/news10.jpeg', name: 'Mr. Carlos Eduardo Vega',     title: 'Social Impact Icon 2022',           nation: 'Brazil',    quote: 'Walking into that hall was profoundly humbling.' },
]

const blank = { name: '', title: '', nation: '', photo: '', quote: '' }

export default function TestimonialsManager() {
  const [items, setItems] = useState(INIT)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const openAdd  = () => setModal({ mode: 'add',  data: { ...blank, id: Date.now() } })
  const openEdit = (t) => setModal({ mode: 'edit', data: { ...t } })
  const upd = (k, v) => setModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  const save = () => {
    if (!modal.data.name.trim()) return
    if (modal.mode === 'add') { setItems(prev => [...prev, modal.data]); showToast('Testimonial added.') }
    else                      { setItems(prev => prev.map(t => t.id === modal.data.id ? modal.data : t)); showToast('Updated.') }
    setModal(null)
  }
  const remove = (id) => { setItems(prev => prev.filter(t => t.id !== id)); showToast('Removed.') }

  return (
    <div>
      <PageHeader title="Testimonials" subtitle={`${items.length} honourees`}>
        <Btn onClick={openAdd}>Add Testimonial</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</span>
              <button onClick={() => setModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['Name', 'name'], ['Award Title', 'title'], ['Country', 'nation'], ['Photo URL', 'photo']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={modal.data[key]} onChange={e => upd(key, e.target.value)} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Quote</label>
                <textarea value={modal.data.quote} onChange={e => upd('quote', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              {modal.data.photo && <img src={modal.data.photo} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={primaryBtn}>Save</button>
              <button onClick={() => setModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((t, idx) => (
          <Card key={t.id}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <img src={t.photo} alt={t.name} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{t.name}</span>
                  <Badge>{t.nation}</Badge>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>#{idx + 1}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5ec8e8', marginBottom: '0.35rem' }}>{t.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.5 }}>"{t.quote}"</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                <Btn size="sm" onClick={() => openEdit(t)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => remove(t.id)}>Remove</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 420, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0d2218', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 8, padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
