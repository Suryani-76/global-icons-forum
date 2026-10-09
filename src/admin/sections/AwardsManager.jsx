import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useAwards } from '../../utils/awardsStore'

const blank = {
  title: '',
  category: 'Business & Entrepreneurship',
  desc: '',
  color: 'orange',
  active: true,
}

const CATEGORIES = [
  'Leadership & Vision',
  'Science & Technology',
  'Diplomacy & Peace',
  'Social Impact',
  'Business & Entrepreneurship',
  'Arts & Culture',
  'Education',
  'Healthcare',
]

export default function AwardsManager() {
  const [awards, setAwards] = useAwards()
  const [modal, setModal]   = useState(null)
  const [toast, setToast]   = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const openAdd  = () => setModal({ mode: 'add', data: { ...blank, id: Date.now() } })
  const openEdit = (a) => setModal({ mode: 'edit', data: { ...a } })
  const upd = (k, v) => setModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  const save = () => {
    const title = modal?.data?.title?.trim() || document.querySelector('#award-title-input')?.value?.trim() || ''
    if (!title) return
    const desc = modal?.data?.desc?.trim() || document.querySelector('#award-desc-input')?.value?.trim() || ''
    const finalData = { ...modal.data, title, desc }
    if (modal.mode === 'add') {
      setAwards(prev => [finalData, ...prev])
      showToast('✓ Award added to live website.')
    } else {
      setAwards(prev => prev.map(a => a.id === modal.data.id ? finalData : a))
      showToast('✓ Award updated on live website.')
    }
    setModal(null)
  }

  const toggleActive = (id) => {
    setAwards(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
    showToast('Award status updated.')
  }

  const remove = (id) => {
    setAwards(prev => prev.filter(a => a.id !== id))
    showToast('Award removed.')
  }

  return (
    <div>
      <PageHeader title="Awards Manager" subtitle={`${awards.length} awards published on live site`}>
        <Btn id="add-award-btn" onClick={openAdd}>+ Add Award</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle} onClick={() => setModal(null)}>
          <div style={{ ...modalStyle, maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Award' : 'Edit Award'}</span>
              <button type="button" onClick={() => setModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Award Title</label>
                <input
                  id="award-title-input"
                  value={modal.data.title}
                  onChange={e => upd('title', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Global Icon of the Year"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select id="award-category-select" value={modal.data.category} onChange={e => upd('category', e.target.value)} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <select id="award-color-select" value={modal.data.color} onChange={e => upd('color', e.target.value)} style={inputStyle}>
                    <option value="orange">Orange Accent</option>
                    <option value="blue">Blue Accent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description / Criteria</label>
                <textarea
                  id="award-desc-input"
                  value={modal.data.desc}
                  onChange={e => upd('desc', e.target.value)}
                  rows={4}
                  placeholder="Describe the significance and selection criteria for this award..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button id="save-award-btn" type="button" onClick={save} style={primaryBtn}>Save Award</button>
              <button type="button" onClick={() => setModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of awards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {awards.map(a => (
          <Card key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge color={a.color === 'blue' ? '#0f7ea3' : '#e05a24'}>{a.category}</Badge>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: a.active !== false ? '#2ecc71' : '#ff6b6b' }}>
                ● {a.active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{a.title}</div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              {a.desc}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Btn size="sm" variant="ghost" onClick={() => openEdit(a)}>✏️ Edit</Btn>
              <Btn size="sm" variant="ghost" onClick={() => toggleActive(a.id)}>
                {a.active !== false ? 'Deactivate' : 'Activate'}
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => remove(a.id)} style={{ color: '#ff6b6b' }}>🗑 Remove</Btn>
            </div>
          </Card>
        ))}
      </div>
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
