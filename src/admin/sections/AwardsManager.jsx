import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const INIT = [
  { id: 1, category: 'Business & Entrepreneurship', awards: ['Business Icon of the Year', 'Startup of the Year', 'Global Entrepreneur Award'], active: true },
  { id: 2, category: 'Arts & Culture',               awards: ['Cultural Excellence Award', 'Cinema Icon Award', 'Performing Arts Award'],     active: true },
  { id: 3, category: 'Science & Technology',         awards: ['Innovation Leader Award', 'Tech Visionary Award', 'Research Excellence Award'], active: true },
  { id: 4, category: 'Social Impact',                awards: ['Humanitarian Award', 'Community Leader Award', 'Youth Empowerment Award'],      active: true },
  { id: 5, category: 'Education',                    awards: ['Education Visionary Award', 'Academic Excellence Award'],                        active: true },
  { id: 6, category: 'Health & Medicine',            awards: ['Healthcare Excellence Award', 'Medical Innovation Award'],                       active: true },
  { id: 7, category: 'Diplomacy & Peace',            awards: ['Peace & Diplomacy Award', 'Global Ambassador Award'],                           active: true },
  { id: 8, category: 'Sports',                       awards: ['Sports Icon Award', 'Lifetime Achievement in Sports'],                          active: false },
]

const blank = { category: '', awards: [], active: true }

export default function AwardsManager() {
  const [cats, setCats]         = useState(INIT)
  const [modal, setModal]       = useState(null)
  const [newAward, setNewAward] = useState('')
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const openAdd  = () => setModal({ mode: 'add',  data: { ...blank, id: Date.now(), awards: [] } })
  const openEdit = (c) => setModal({ mode: 'edit', data: { ...c, awards: [...c.awards] } })

  const save = () => {
    if (!modal.data.category.trim()) return
    if (modal.mode === 'add') { setCats(prev => [...prev, modal.data]); showToast('Category added.') }
    else                      { setCats(prev => prev.map(c => c.id === modal.data.id ? modal.data : c)); showToast('Updated.') }
    setModal(null); setNewAward('')
  }
  const addAward    = () => { if (!newAward.trim()) return; setModal(p => ({ ...p, data: { ...p.data, awards: [...p.data.awards, newAward.trim()] } })); setNewAward('') }
  const removeAward = (i) => setModal(p => ({ ...p, data: { ...p.data, awards: p.data.awards.filter((_, idx) => idx !== i) } }))
  const toggleActive = (id) => { setCats(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c)); showToast('Status toggled.') }
  const remove = (id) => { setCats(prev => prev.filter(c => c.id !== id)); showToast('Removed.') }

  return (
    <div>
      <PageHeader title="Awards Manager" subtitle={`${cats.length} categories`}>
        <Btn onClick={openAdd}>Add Category</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Category' : 'Edit Category'}</span>
              <button onClick={() => { setModal(null); setNewAward('') }} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Category Name</label>
                <input value={modal.data.category} onChange={e => setModal(p => ({ ...p, data: { ...p.data, category: e.target.value } }))} style={inputStyle} autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Awards</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input value={newAward} onChange={e => setNewAward(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAward()} placeholder="Award name..." style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={addAward} style={{ ...primaryBtn, flex: 'none', padding: '0.6rem 1rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {modal.data.awards.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1a2636', borderRadius: 7, padding: '0.4rem 0.75rem' }}>
                      <span style={{ flex: 1, fontSize: '0.82rem', color: '#fff' }}>{a}</span>
                      <button onClick={() => removeAward(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={primaryBtn}>Save</button>
              <button onClick={() => { setModal(null); setNewAward('') }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {cats.map(cat => (
          <Card key={cat.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{cat.category}</div>
                <Badge color={cat.active ? '#2ecc71' : '#888'}>{cat.active ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.85rem' }}>
              {cat.awards.map((a, i) => (
                <div key={i} style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.5)', paddingLeft: '0.65rem', borderLeft: '2px solid rgba(224,90,36,0.35)' }}>{a}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Btn size="sm" onClick={() => openEdit(cat)}>Edit</Btn>
              <Btn size="sm" variant="ghost" onClick={() => toggleActive(cat.id)}>{cat.active ? 'Deactivate' : 'Activate'}</Btn>
              <Btn size="sm" variant="danger" onClick={() => remove(cat.id)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0d2218', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 8, padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
