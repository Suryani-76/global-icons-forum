import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const INIT = [
  { id: 1,  photo: '/newspicture 1.jpeg', headline: 'Global Icons Forum Society Launches National Summit',         publication: 'Deccan Chronicle', date: '2025-03-10', category: 'Summit',    status: 'Published' },
  { id: 2,  photo: '/newspicture 2.jpeg', headline: 'Vijayawada Icons Honoured at Global Forum Ceremony',          publication: 'Eenadu',           date: '2025-04-18', category: 'Awards',    status: 'Published' },
  { id: 3,  photo: '/newspicture 3.jpeg', headline: 'Global Icons Forum Receives ISO 9001:2015 Certification',     publication: 'The Hindu',        date: '2026-07-20', category: 'Milestone', status: 'Published' },
  { id: 4,  photo: '/newspicture 4.jpeg', headline: 'Super Star Krishna Awards 2025 — A Grand Celebration',        publication: 'Sakshi',           date: '2025-02-14', category: 'Awards',    status: 'Published' },
  { id: 5,  photo: '/newspicture 5.jpeg', headline: 'GIF Society Expands Chapters Across South India',             publication: 'Andhra Jyothy',    date: '2025-06-05', category: 'Expansion', status: 'Published' },
  { id: 6,  photo: '/news1.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-01', category: 'Media',     status: 'Published' },
  { id: 7,  photo: '/news2.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-02', category: 'Media',     status: 'Published' },
  { id: 8,  photo: '/news3.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-03', category: 'Media',     status: 'Published' },
  { id: 9,  photo: '/news4.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-04', category: 'Media',     status: 'Published' },
  { id: 10, photo: '/news5.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-05', category: 'Media',     status: 'Published' },
  { id: 11, photo: '/news6.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-06', category: 'Media',     status: 'Published' },
  { id: 12, photo: '/news7.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-07', category: 'Media',     status: 'Published' },
  { id: 13, photo: '/news8.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-08', category: 'Media',     status: 'Published' },
  { id: 14, photo: '/news9.jpeg',         headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-09', category: 'Media',     status: 'Published' },
  { id: 15, photo: '/news10.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-10', category: 'Media',     status: 'Published' },
  { id: 16, photo: '/news11.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-11', category: 'Media',     status: 'Published' },
  { id: 17, photo: '/news12.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-12', category: 'Media',     status: 'Published' },
  { id: 18, photo: '/news13.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-13', category: 'Media',     status: 'Published' },
  { id: 19, photo: '/news14.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-14', category: 'Media',     status: 'Published' },
  { id: 20, photo: '/news15.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-15', category: 'Media',     status: 'Published' },
  { id: 21, photo: '/news16.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-16', category: 'Media',     status: 'Published' },
  { id: 22, photo: '/news17.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-17', category: 'Media',     status: 'Published' },
  { id: 23, photo: '/news18.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-18', category: 'Media',     status: 'Published' },
  { id: 24, photo: '/news19.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-19', category: 'Media',     status: 'Published' },
  { id: 25, photo: '/news20.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-20', category: 'Media',     status: 'Published' },
  { id: 26, photo: '/news21.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-21', category: 'Media',     status: 'Published' },
  { id: 27, photo: '/news22.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-22', category: 'Media',     status: 'Published' },
  { id: 28, photo: '/news23.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-23', category: 'Media',     status: 'Published' },
  { id: 29, photo: '/news24.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-24', category: 'Media',     status: 'Published' },
  { id: 30, photo: '/news25.jpeg',        headline: 'News Coverage — Global Icons Forum',                          publication: 'Media Coverage',   date: '2025-01-25', category: 'Media',     status: 'Published' },
]

const CATEGORIES = ['Awards', 'Summit', 'Milestone', 'Expansion', 'Community', 'Media', 'Other']
const STATUSES   = ['Published', 'Draft', 'Archived']
const statusColor = { Published: '#2ecc71', Draft: '#f7c430', Archived: '#888' }

const blank = { headline: '', publication: '', date: '', category: 'Awards', status: 'Published', photo: '' }

export default function NewspaperManager() {
  const [items, setItems]     = useState(INIT)
  const [modal, setModal]     = useState(null)
  const [photoMode, setPhotoMode] = useState('url')
  const [filter, setFilter]   = useState('All')
  const [toast, setToast]     = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const openAdd  = () => { setPhotoMode('url'); setPreview(null); setModal({ mode: 'add',  data: { ...blank, id: Date.now() } }) }
  const openEdit = (n) => { setPhotoMode('url'); setPreview(n.photo); setModal({ mode: 'edit', data: { ...n } }) }
  const upd = (k, v) => setModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      upd('photo', ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!modal.data.headline.trim()) return
    if (modal.mode === 'add') { setItems(prev => [modal.data, ...prev]); showToast('Article added.') }
    else                      { setItems(prev => prev.map(i => i.id === modal.data.id ? modal.data : i)); showToast('Updated.') }
    setModal(null); setPreview(null)
  }

  const remove  = (id) => { setItems(prev => prev.filter(i => i.id !== id)); showToast('Removed.') }
  const toggle  = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'Published' ? 'Archived' : 'Published' } : i))
    showToast('Status updated.')
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter || i.category === filter)

  return (
    <div>
      <PageHeader title="Newspaper Coverage" subtitle={`${items.length} articles`}>
        <Btn onClick={openAdd}>+ Add Article</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', ...STATUSES, ...CATEGORIES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.3rem 0.85rem', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
            background: filter === f ? 'rgba(224,90,36,0.18)' : 'rgba(255,255,255,0.04)',
            color: filter === f ? '#e05a24' : 'rgba(255,255,255,0.4)',
            fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          }}>{f}</button>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Newspaper Article' : 'Edit Article'}</span>
              <button onClick={() => { setModal(null); setPreview(null) }} style={closeBtn}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Headline */}
              <div>
                <label style={labelStyle}>Headline</label>
                <input value={modal.data.headline} onChange={e => upd('headline', e.target.value)} style={inputStyle} placeholder="e.g. Global Icons Forum Honours Excellence..." autoFocus />
              </div>

              {/* Publication + Date row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Publication / Newspaper</label>
                  <input value={modal.data.publication} onChange={e => upd('publication', e.target.value)} style={inputStyle} placeholder="e.g. Deccan Chronicle" />
                </div>
                <div>
                  <label style={labelStyle}>Date (YYYY-MM-DD)</label>
                  <input value={modal.data.date} onChange={e => upd('date', e.target.value)} style={inputStyle} placeholder="2026-08-01" />
                </div>
              </div>

              {/* Category + Status row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={modal.data.category} onChange={e => upd('category', e.target.value)} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={modal.data.status} onChange={e => upd('status', e.target.value)} style={inputStyle}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Photo */}
              <div>
                <label style={labelStyle}>Newspaper Photo</label>
                <div style={{ display: 'flex', background: '#1a2636', borderRadius: 8, padding: 3, marginBottom: '0.6rem' }}>
                  {[['url', 'Paste URL'], ['upload', 'Upload File']].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setPhotoMode(id)} style={{
                      flex: 1, padding: '0.4rem', borderRadius: 6, border: 'none',
                      background: photoMode === id ? '#e05a24' : 'transparent',
                      color: photoMode === id ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
                    }}>{label}</button>
                  ))}
                </div>

                {photoMode === 'url' && (
                  <input value={modal.data.photo} onChange={e => { upd('photo', e.target.value); setPreview(e.target.value) }}
                    style={inputStyle} placeholder="/newspicture 1.jpeg or https://..." />
                )}

                {photoMode === 'upload' && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileRef.current.click()} style={{
                      width: '100%', padding: '1.25rem', border: '1.5px dashed rgba(255,255,255,0.15)',
                      borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', fontSize: '0.82rem', boxSizing: 'border-box',
                    }}>
                      {preview && modal.data.photo?.startsWith('data:') ? '✓ File selected' : 'Click to choose image'}
                    </button>
                  </>
                )}

                {/* Preview */}
                {preview && (
                  <img src={preview} alt="preview" onError={() => setPreview(null)}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginTop: '0.6rem', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }} />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={primaryBtn}>Save</button>
              <button onClick={() => { setModal(null); setPreview(null) }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => (
          <Card key={item.id} style={{ padding: 0, overflow: 'hidden' }}>
            {/* Photo */}
            <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#0d1f2d' }}>
              {item.photo ? (
                <img src={item.photo} alt={item.headline}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '2.5rem' }}>📰</div>
              )}
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
              {/* Status badge */}
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <Badge color={statusColor[item.status]}>{item.status}</Badge>
              </div>
              {/* Category badge */}
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <Badge color="#0f7ea3">{item.category}</Badge>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                {item.headline}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#e05a24' }}>{item.publication}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>📅 {item.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Btn size="sm" onClick={() => openEdit(item)}>Edit</Btn>
                <Btn size="sm" variant="ghost" onClick={() => toggle(item.id)}>
                  {item.status === 'Published' ? 'Archive' : 'Publish'}
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => remove(item.id)}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '4rem', fontSize: '0.9rem' }}>
            No articles match the selected filter.
          </div>
        )}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 520, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0d2218', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 8, padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
