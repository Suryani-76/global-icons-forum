import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useNewspaperItems } from '../../utils/newspaperStore'
import { processImageFile } from '../../utils/imageProcessor'

const CATEGORIES = ['Awards', 'Summit', 'Milestone', 'Expansion', 'Community', 'Media', 'Other']
const STATUSES   = ['Published', 'Draft', 'Archived']
const statusColor = { Published: '#2ecc71', Draft: '#f7c430', Archived: '#888' }

const blank = {
  headline: '',
  publication: 'Media Coverage',
  date: new Date().toISOString().slice(0, 10),
  category: 'Awards',
  status: 'Published',
  photo: '',
}

export default function NewspaperManager() {
  const [items, setItems]     = useNewspaperItems()
  const [modal, setModal]     = useState(null)
  const [filter, setFilter]   = useState('All')
  const [preview, setPreview] = useState(null)
  const [photoMode, setPhotoMode] = useState('upload') // Default to upload mode
  const [toast, setToast]     = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const [isDragging, setIsDragging]     = useState(false)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const openAdd = () => {
    setPhotoMode('upload')
    setPreview(null)
    setUploadError('')
    setModal({ mode: 'add', data: { ...blank, id: Date.now() } })
  }

  const openEdit = (n) => {
    setPhotoMode(n.photo?.startsWith('data:') ? 'upload' : 'url')
    setPreview(n.photo)
    setUploadError('')
    setModal({ mode: 'edit', data: { ...n } })
  }

  const upd = (k, v) => setModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  const handleSelectedFile = async (file) => {
    if (!file) return
    setUploadError('')
    setIsProcessing(true)

    try {
      const result = await processImageFile(file, 1100, 0.76)
      setPreview(result.dataUrl)
      upd('photo', result.dataUrl)
    } catch (err) {
      console.error('Newspaper upload error:', err)
      setUploadError(err.message || 'Failed to process image. Please try another file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    handleSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleSelectedFile(file)
  }

  const save = () => {
    if (!modal.data.headline.trim()) {
      setUploadError('Please enter an article headline.')
      return
    }
    const finalData = {
      ...modal.data,
      photo: preview || modal.data.photo || '',
    }
    if (modal.mode === 'add') {
      setItems(prev => [finalData, ...prev])
      showToast('✓ Article added & saved.')
    } else {
      setItems(prev => prev.map(i => i.id === modal.data.id ? finalData : i))
      showToast('✓ Article updated.')
    }
    setModal(null)
    setPreview(null)
    setIsProcessing(false)
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    showToast('Removed.')
  }

  const toggle = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'Published' ? 'Archived' : 'Published' } : i))
    showToast('Status updated.')
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter || i.category === filter)

  return (
    <div>
      <PageHeader title="Newspaper Coverage" subtitle={`${items.length} articles published`}>
        <Btn id="add-newspaper-btn" onClick={openAdd}>+ Add Article</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', ...STATUSES, ...CATEGORIES].map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)} style={{
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
        <div style={overlayStyle} onClick={() => { setModal(null); setPreview(null); setIsProcessing(false) }}>
          <div style={{ ...modalStyle, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Newspaper Article' : 'Edit Article'}</span>
              <button type="button" onClick={() => { setModal(null); setPreview(null); setIsProcessing(false) }} style={closeBtn}>✕</button>
            </div>

            {uploadError && (
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: 8, background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7676', fontSize: '0.8rem', marginBottom: '1rem' }}>
                ⚠️ {uploadError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Headline */}
              <div>
                <label style={labelStyle}>Headline</label>
                <input id="newspaper-headline-input" value={modal.data.headline} onChange={e => upd('headline', e.target.value)} style={inputStyle} placeholder="e.g. Global Icons Forum Honours Excellence..." autoFocus />
              </div>

              {/* Publication + Date row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Publication / Newspaper</label>
                  <input id="newspaper-pub-input" value={modal.data.publication} onChange={e => upd('publication', e.target.value)} style={inputStyle} placeholder="e.g. Deccan Chronicle" />
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
                <label style={labelStyle}>Newspaper Clipping Photo</label>
                <div style={{ display: 'flex', background: '#1a2636', borderRadius: 8, padding: 3, marginBottom: '0.6rem' }}>
                  {[['upload', 'Upload File / Drag & Drop'], ['url', 'Paste URL']].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => { setPhotoMode(id); setUploadError('') }} style={{
                      flex: 1, padding: '0.4rem', borderRadius: 6, border: 'none',
                      background: photoMode === id ? '#e05a24' : 'transparent',
                      color: photoMode === id ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
                    }}>{label}</button>
                  ))}
                </div>

                {photoMode === 'url' && (
                  <input
                    value={modal.data.photo}
                    onChange={e => { upd('photo', e.target.value); setPreview(e.target.value) }}
                    style={inputStyle}
                    placeholder="/newspicture 1.jpeg or https://..."
                  />
                )}

                {photoMode === 'upload' && (
                  <>
                    <input
                      id="newspaper-file-input"
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }}
                    />
                    <div
                      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (fileRef.current) {
                          fileRef.current.value = ''
                          fileRef.current.click()
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: `1.5px dashed ${isDragging ? '#e05a24' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: 8,
                        background: isDragging ? 'rgba(224,90,36,0.08)' : 'transparent',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                      }}
                    >
                      {isProcessing
                        ? '⏳ Optimizing newspaper clipping...'
                        : preview
                          ? '✓ Photo selected (click or drop to change)'
                          : 'Click to choose image or drag & drop'}
                    </div>
                  </>
                )}

                {/* Preview */}
                {preview && (
                  <div style={{ marginTop: '0.6rem', position: 'relative' }}>
                    <img
                      src={preview}
                      alt="preview"
                      onError={() => setUploadError('Image preview failed. Please check file format.')}
                      style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, display: 'block', border: '1px solid rgba(255,255,255,0.08)', background: '#0a1017' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button id="save-newspaper-btn" type="button" onClick={save} disabled={isProcessing} style={primaryBtn}>
                {isProcessing ? 'Processing...' : 'Save Article'}
              </button>
              <button type="button" onClick={() => { setModal(null); setPreview(null); setIsProcessing(false) }} style={ghostBtn}>Cancel</button>
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
                <img
                  src={item.photo}
                  alt={item.headline}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
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
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', lineHeight: 1.35, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.headline}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                <span style={{ color: '#e05a24', fontWeight: 600 }}>{item.publication}</span>
                <span>{item.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Btn size="sm" onClick={() => openEdit(item)}>Edit</Btn>
                <Btn size="sm" variant="ghost" onClick={() => toggle(item.id)}>
                  {item.status === 'Published' ? 'Archive' : 'Publish'}
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

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 520, background: '#111c26', borderRadius: 14, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '1rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }
const inputStyle   = { width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }

function Toast({ msg }) {
  return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0d2818', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>{msg}</div>
}
