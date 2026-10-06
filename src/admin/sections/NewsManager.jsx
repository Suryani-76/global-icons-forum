import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useNewsItems } from '../../utils/newsStore'
import { processImageFile } from '../../utils/imageProcessor'

const STATUSES = ['Published', 'Draft', 'Unpublished']
const statusColor = { Published: '#2ecc71', Draft: '#f7c430', Unpublished: '#ff6b6b' }
const CATEGORIES = ['Events', 'Awards', 'Announcement', 'Media', 'Community']

const blank = {
  title: '',
  category: 'Events',
  date: new Date().toISOString().slice(0, 10),
  status: 'Published',
  photo: '',
  excerpt: '',
}

export default function NewsManager() {
  const [items, setItems, resetToDefaults] = useNewsItems()
  const [modal, setModal]       = useState(null)
  const [toast, setToast]       = useState('')
  const [filter, setFilter]     = useState('All')
  const [photoMode, setPhotoMode] = useState('upload')
  const [preview, setPreview]   = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const [isDragging, setIsDragging]     = useState(false)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const openAdd = () => {
    setPhotoMode('upload')
    setPreview(null)
    setUploadError('')
    setIsProcessing(false)
    setModal({ mode: 'add', data: { ...blank, id: Date.now() } })
  }

  const openEdit = (n) => {
    setPhotoMode(n.photo?.startsWith('data:') ? 'upload' : 'url')
    setPreview(n.photo || null)
    setUploadError('')
    setIsProcessing(false)
    setModal({ mode: 'edit', data: { ...n } })
  }

  const closeModal = () => {
    setModal(null)
    setPreview(null)
    setIsProcessing(false)
    setUploadError('')
    if (fileRef.current) fileRef.current.value = ''
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
      console.error('News image error:', err)
      setUploadError(err.message || 'Failed to process image.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e) => {
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
    if (!modal.data.title.trim()) {
      setUploadError('Please enter an article title.')
      return
    }
    const finalData = {
      ...modal.data,
      photo: preview || modal.data.photo || '/events.jpeg',
    }
    if (modal.mode === 'add') {
      setItems(prev => [finalData, ...prev])
      showToast('✓ Article created and published to live website.')
    } else {
      setItems(prev => prev.map(i => i.id === modal.data.id ? finalData : i))
      showToast('✓ Article updated on live website.')
    }
    closeModal()
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    showToast('Article deleted.')
  }

  const toggle = (id, st) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: st } : i))
    showToast(`Status changed to ${st}`)
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter)

  return (
    <div>
      <PageHeader title="News & Events" subtitle={`${items.length} articles on live site`}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Btn variant="ghost" size="sm" onClick={() => {
            if (confirm('Reset news to default articles?')) {
              resetToDefaults()
              showToast('News reset to defaults.')
            }
          }}>
            ↺ Reset Defaults
          </Btn>
          <Btn id="add-news-btn" onClick={openAdd}>+ New Article</Btn>
        </div>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.12)',
              background: filter === s ? 'rgba(224,90,36,0.18)' : 'rgba(255,255,255,0.04)',
              color: filter === s ? '#e05a24' : 'rgba(255,255,255,0.45)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={{ ...modalStyle, maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'New Article' : 'Edit Article'}</span>
              <button type="button" onClick={closeModal} style={closeBtn}>✕</button>
            </div>

            {uploadError && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                background: 'rgba(255,80,80,0.12)',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff7676',
                fontSize: '0.8rem',
              }}>
                ⚠️ {uploadError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Article Title</label>
                <input
                  id="news-title-input"
                  value={modal.data.title}
                  onChange={e => upd('title', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Super Star Krishna Awards 2026 Announced"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={modal.data.category} onChange={e => upd('category', e.target.value)} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date (YYYY-MM-DD)</label>
                  <input value={modal.data.date} onChange={e => upd('date', e.target.value)} style={inputStyle} placeholder="2026-09-01" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select value={modal.data.status} onChange={e => upd('status', e.target.value)} style={inputStyle}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Photo Mode toggle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Article Photo</label>
                  <div style={{ display: 'flex', background: '#1a2636', borderRadius: 6, padding: 2 }}>
                    {[['upload', 'Upload / Drag & Drop'], ['url', 'Image URL']].map(([mode, lbl]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPhotoMode(mode)}
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 4,
                          border: 'none',
                          background: photoMode === mode ? '#e05a24' : 'transparent',
                          color: photoMode === mode ? '#fff' : 'rgba(255,255,255,0.4)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {photoMode === 'url' && (
                  <input
                    value={modal.data.photo || ''}
                    onChange={e => { upd('photo', e.target.value); setPreview(e.target.value) }}
                    style={inputStyle}
                    placeholder="/events.jpeg or https://..."
                  />
                )}

                {photoMode === 'upload' && (
                  <>
                    <input
                      id="news-file-input"
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }}
                    />
                    <div
                      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (isProcessing) return
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
                        cursor: isProcessing ? 'wait' : 'pointer',
                        fontSize: '0.82rem',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                      }}
                    >
                      {isProcessing
                        ? '⏳ Optimizing image...'
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
                    <button
                      type="button"
                      onClick={() => { setPreview(null); upd('photo', '') }}
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        color: '#ff6b6b',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Article Excerpt / Summary</label>
                <textarea
                  id="news-excerpt-input"
                  value={modal.data.excerpt}
                  onChange={e => upd('excerpt', e.target.value)}
                  rows={3}
                  placeholder="Summary of the news or event..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button id="save-news-btn" type="button" onClick={save} disabled={isProcessing} style={primaryBtn}>
                {isProcessing ? 'Processing...' : 'Save Article'}
              </button>
              <button type="button" onClick={closeModal} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => (
          <Card key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, overflow: 'hidden' }}>
            {item.photo && (
              <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: '#0a1017' }}>
                <img src={item.photo} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Badge color={statusColor[item.status]}>{item.status}</Badge>
                </div>
              </div>
            )}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.title}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge>{item.category}</Badge>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{item.date}</span>
                {!item.photo && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor[item.status] }}>● {item.status}</span>
                )}
              </div>
              {item.excerpt && (
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {item.excerpt}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}>✏️ Edit</Btn>
                {item.status !== 'Published' && (
                  <Btn size="sm" variant="ghost" onClick={() => toggle(item.id, 'Published')}>Publish</Btn>
                )}
                {item.status === 'Published' && (
                  <Btn size="sm" variant="ghost" onClick={() => toggle(item.id, 'Draft')}>Draft</Btn>
                )}
                <Btn size="sm" variant="ghost" onClick={() => remove(item.id)} style={{ color: '#ff6b6b' }}>🗑</Btn>
              </div>
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
