import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const STATUSES = ['Published', 'Draft', 'Unpublished']
const statusColor = { Published: '#2ecc71', Draft: '#f7c430', Unpublished: '#ff6b6b' }
const CATEGORIES = ['Events', 'Awards', 'Announcement', 'Media', 'Community']

const INIT = [
  { id: 1, title: 'Global Icons Forum — Super Star Krishna Awards 2025', category: 'Awards',        date: '2025-03-15', status: 'Published',   excerpt: 'A grand celebration honouring legends of Telugu cinema at the Super Star Krishna Awards 2025.' },
  { id: 2, title: 'ISO 9001:2015 Certification Achieved',                category: 'Announcement', date: '2026-07-18', status: 'Published',   excerpt: 'Global Icons Forum Society receives ISO 9001:2015 certification from MQA Certification Services, UK.' },
  { id: 3, title: 'Global Icons Forum National Summit 2026',             category: 'Events',        date: '2026-09-01', status: 'Draft',       excerpt: 'A national summit bringing together icons from business, arts, science and diplomacy.' },
]

const blank = { title: '', category: 'Events', date: '', status: 'Draft', excerpt: '' }

export default function NewsManager() {
  const [items, setItems]   = useState(INIT)
  const [modal, setModal]   = useState(null)
  const [toast, setToast]   = useState('')
  const [filter, setFilter] = useState('All')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const openAdd  = () => setModal({ mode: 'add',  data: { ...blank, id: Date.now() } })
  const openEdit = (n) => setModal({ mode: 'edit', data: { ...n } })
  const upd = (k, v) => setModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  const save = () => {
    if (!modal.data.title.trim()) return
    if (modal.mode === 'add') { setItems(prev => [modal.data, ...prev]); showToast('Article added.') }
    else                      { setItems(prev => prev.map(i => i.id === modal.data.id ? modal.data : i)); showToast('Updated.') }
    setModal(null)
  }
  const remove = (id) => { setItems(prev => prev.filter(i => i.id !== id)); showToast('Deleted.') }
  const toggle = (id, st) => { setItems(prev => prev.map(i => i.id === id ? { ...i, status: st } : i)); showToast(`Status: ${st}`) }

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter)

  return (
    <div>
      <PageHeader title="News & Events" subtitle={`${items.length} articles`}>
        <Btn onClick={openAdd}>New Article</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '0.35rem 0.9rem', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.12)',
            background: filter === s ? 'rgba(224,90,36,0.18)' : 'rgba(255,255,255,0.04)',
            color: filter === s ? '#e05a24' : 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          }}>{s}</button>
        ))}
      </div>

      {modal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'New Article' : 'Edit Article'}</span>
              <button onClick={() => setModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['Title', 'title'], ['Date (YYYY-MM-DD)', 'date']].map(([label, key]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input value={modal.data[key]} onChange={e => upd(key, e.target.value)} style={inputStyle} /></div>
              ))}
              <div><label style={labelStyle}>Category</label>
                <select value={modal.data.category} onChange={e => upd('category', e.target.value)} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Status</label>
                <select value={modal.data.status} onChange={e => upd('status', e.target.value)} style={inputStyle}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Excerpt</label>
                <textarea value={modal.data.excerpt} onChange={e => upd('excerpt', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={primaryBtn}>Save</button>
              <button onClick={() => setModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(item => (
          <Card key={item.id}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.35rem' }}>{item.title}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge>{item.category}</Badge>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{item.date}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor[item.status] }}>● {item.status}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{item.excerpt}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                <Btn size="sm" onClick={() => openEdit(item)}>Edit</Btn>
                <Btn size="sm" variant="ghost" onClick={() => toggle(item.id, item.status === 'Published' ? 'Unpublished' : 'Published')}>
                  {item.status === 'Published' ? 'Unpublish' : 'Publish'}
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => remove(item.id)}>Delete</Btn>
              </div>
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
