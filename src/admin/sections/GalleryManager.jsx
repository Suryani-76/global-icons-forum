import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const INIT = [
  { id: 1, src: '/gallery14.jpeg',  caption: 'Global Icons Forum — Award Ceremony' },
  { id: 2, src: '/gallery15.jpeg',  caption: 'Global Icons Forum — Award Ceremony' },
  { id: 3, src: '/gallery20.jpeg',  caption: 'Global Icons Forum — Award Ceremony' },
  { id: 4, src: '/gallery18.jpeg',  caption: 'Global Icons Forum — Award Ceremony' },
  { id: 5, src: '/gallery19.jpeg',  caption: 'Global Icons Forum — Award Ceremony' },
  ...Array.from({ length: 18 }, (_, i) => ({ id: i + 6, src: `/photo ${i + 1}.jpeg`, caption: 'Global Icons Forum — Excellence Event' })),
]

export default function GalleryManager() {
  const [images, setImages]   = useState(INIT)
  const [editing, setEditing] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [newUrl, setNewUrl]   = useState('')
  const [newCaption, setNewCaption] = useState('Global Icons Forum — Event')
  const [preview, setPreview] = useState(null) // base64 or url string
  const [addMode, setAddMode] = useState('url') // 'url' | 'upload'
  const [toast, setToast]     = useState('')
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const deleteImg   = (id) => { setImages(prev => prev.filter(i => i.id !== id)); showToast('Photo removed.') }
  const saveCaption = () => {
    setImages(prev => prev.map(i => i.id === editing.id ? { ...i, caption: editing.caption } : i))
    setEditing(null); showToast('Caption updated.')
  }
  const moveUp   = (idx) => { if (idx === 0) return; const a = [...images]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; setImages(a) }
  const moveDown = (idx) => { if (idx === images.length - 1) return; const a = [...images]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; setImages(a) }

  // handle file pick → base64 preview
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    setNewCaption(file.name.replace(/\.[^.]+$/, ''))
  }

  const openAdd = () => {
    setNewUrl(''); setNewCaption('Global Icons Forum — Event')
    setPreview(null); setAddMode('url')
    setAddModal(true)
  }

  const confirmAdd = () => {
    const src = addMode === 'upload' ? preview : newUrl.trim()
    if (!src) { showToast('Please provide an image.'); return }
    setImages(prev => [...prev, { id: Date.now(), src, caption: newCaption.trim() || 'Global Icons Forum — Event' }])
    setAddModal(false); setPreview(null); setNewUrl('')
    showToast('Photo added to gallery.')
  }

  return (
    <div>
      <PageHeader title="Gallery Manager" subtitle={`${images.length} photos`}>
        <Btn onClick={openAdd}>+ Add Photo</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* ── ADD MODAL ── */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: 440, background: '#111c26', borderRadius: 14, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>

            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Add Photo</span>
              <button onClick={() => { setAddModal(false); setPreview(null) }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>✕</button>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', background: '#1a2636', borderRadius: 8, padding: 3, marginBottom: '1.5rem' }}>
              {[['url', 'Paste URL'], ['upload', 'Upload File']].map(([id, label]) => (
                <button key={id} onClick={() => { setAddMode(id); setPreview(null); setNewUrl('') }} style={{
                  flex: 1, padding: '0.45rem', borderRadius: 6, border: 'none',
                  background: addMode === id ? '#e05a24' : 'transparent',
                  color: addMode === id ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                }}>{label}</button>
              ))}
            </div>

            {/* URL */}
            {addMode === 'url' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Image URL</label>
                <input value={newUrl} onChange={e => { setNewUrl(e.target.value); setPreview(e.target.value) }}
                  placeholder="/gallery21.jpeg or https://..." style={inputStyle} autoFocus />
              </div>
            )}

            {/* Upload */}
            {addMode === 'upload' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>File</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                <button onClick={() => fileRef.current.click()} style={{
                  width: '100%', padding: '1.5rem', border: '1.5px dashed rgba(255,255,255,0.15)',
                  borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', fontSize: '0.83rem', boxSizing: 'border-box',
                }}>
                  {preview ? '✓ File selected' : 'Click to choose an image'}
                </button>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Preview</label>
                <img src={preview} alt="preview" onError={() => setPreview(null)}
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
              </div>
            )}

            {/* Caption */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Caption</label>
              <input value={newCaption} onChange={e => setNewCaption(e.target.value)}
                placeholder="e.g. Award Ceremony 2026" style={inputStyle} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={confirmAdd} style={{
                flex: 1, padding: '0.7rem', borderRadius: 8, border: 'none',
                background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              }}>Add to Gallery</button>
              <button onClick={() => { setAddModal(false); setPreview(null) }} style={{
                padding: '0.7rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
              }}>Cancel</button>
            </div>

          </div>
        </div>
      )}

      {/* ── EDIT CAPTION MODAL ── */}
      {editing && (
        <div style={overlayStyle}>
          <Card style={{ maxWidth: 420, width: '100%' }}>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Edit Caption</div>
            <img src={editing.src} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem' }} />
            <input value={editing.caption} onChange={e => setEditing(p => ({ ...p, caption: e.target.value }))} style={inputStyle} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Btn onClick={saveCaption}>Save</Btn>
              <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map((img, idx) => (
          <Card key={img.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={img.src} alt={img.caption} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 6, left: 6 }}>
                <Badge>{idx + 1}</Badge>
              </div>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.6rem', lineHeight: 1.4 }}>{img.caption}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Btn size="sm" onClick={() => setEditing(img)}>✏️ Edit</Btn>
                <Btn size="sm" variant="ghost" onClick={() => moveUp(idx)}>↑</Btn>
                <Btn size="sm" variant="ghost" onClick={() => moveDown(idx)}>↓</Btn>
                <Btn size="sm" variant="danger" onClick={() => deleteImg(img.id)}>🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
const inputStyle   = { width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }

function Toast({ msg }) {
  return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>{msg}</div>
}
