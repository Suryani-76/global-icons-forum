import { useState, useRef } from 'react'
import { Card, PageHeader, Btn } from '../AdminUI'
import { useTestimonials } from '../../utils/testimonialsStore'
import { processImageFile } from '../../utils/imageProcessor'

const blank = { name: '', title: '', nation: '', photo: '', quote: '', color: '#ffffff' }

export default function TestimonialsManager() {
  const [items, setItems] = useTestimonials()
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [photoMode, setPhotoMode] = useState('upload')
  const [preview, setPreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const openAdd = () => {
    setPhotoMode('upload')
    setPreview(null)
    setUploadError('')
    setIsProcessing(false)
    setModal({ mode: 'add', data: { ...blank, id: Date.now() } })
  }

  const openEdit = (t) => {
    setPhotoMode(t.photo?.startsWith('data:') ? 'upload' : 'url')
    setPreview(t.photo || null)
    setUploadError('')
    setIsProcessing(false)
    setModal({ mode: 'edit', data: { ...t } })
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
      const result = await processImageFile(file, 600, 0.85)
      setPreview(result.dataUrl)
      upd('photo', result.dataUrl)
    } catch (err) {
      console.error('Testimonial image error:', err)
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
    const name = modal.data.name.trim() || document.querySelector('#testimonial-name-input')?.value?.trim() || ''
    if (!name) {
      setUploadError('Please enter honouree name.')
      return
    }
    const title = modal.data.title || document.querySelector('#testimonial-title-input')?.value?.trim() || ''
    const nation = modal.data.nation || document.querySelector('#testimonial-nation-input')?.value?.trim() || ''
    const finalData = {
      ...modal.data,
      name,
      title,
      nation,
      photo: preview || modal.data.photo || '/news1.jpeg',
    }
    if (modal.mode === 'add') {
      setItems(prev => [finalData, ...prev])
      showToast('✓ Testimonial added to live site.')
    } else {
      setItems(prev => prev.map(t => t.id === modal.data.id ? finalData : t))
      showToast('✓ Testimonial updated on live site.')
    }
    closeModal()
  }

  const remove = (id) => {
    setItems(prev => prev.filter(t => t.id !== id))
    showToast('Testimonial removed.')
  }

  return (
    <div>
      <PageHeader title="Testimonials" subtitle={`${items.length} honourees published on live site`}>
        <Btn id="add-testimonial-btn" onClick={openAdd}>+ Add Testimonial</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={{ ...modalStyle, maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</span>
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
                <label style={labelStyle}>Full Name</label>
                <input
                  id="testimonial-name-input"
                  value={modal.data.name}
                  onChange={e => upd('name', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Dr. Priya Sharma"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Award / Title</label>
                  <input
                    id="testimonial-title-input"
                    value={modal.data.title}
                    onChange={e => upd('title', e.target.value)}
                    style={inputStyle}
                    placeholder="Global Innovator of the Year"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Country / Nation</label>
                  <input
                    id="testimonial-nation-input"
                    value={modal.data.nation}
                    onChange={e => upd('nation', e.target.value)}
                    style={inputStyle}
                    placeholder="India, France, etc."
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Honouree Photo</label>
                  <div style={{ display: 'flex', background: '#1a2636', borderRadius: 6, padding: 2 }}>
                    {[['upload', 'Upload / Drop'], ['url', 'Photo URL']].map(([mode, lbl]) => (
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
                    id="testimonial-photo-url"
                    value={modal.data.photo || ''}
                    onChange={e => { upd('photo', e.target.value); setPreview(e.target.value) }}
                    style={inputStyle}
                    placeholder="/news1.jpeg or https://..."
                  />
                )}

                {photoMode === 'upload' && (
                  <>
                    <input
                      id="testimonial-file-input"
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
                        ? '⏳ Optimizing photo...'
                        : preview
                          ? '✓ Photo selected (click or drop to change)'
                          : 'Click to choose image or drag & drop'}
                    </div>
                  </>
                )}

                {preview && (
                  <div style={{ marginTop: '0.6rem', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#0a1017', padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={preview} alt="preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.78rem', color: '#2ecc71', fontWeight: 600 }}>Ready to save</span>
                    <button
                      type="button"
                      onClick={() => { setPreview(null); upd('photo', '') }}
                      style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Quote / Testimonial</label>
                <textarea
                  value={modal.data.quote}
                  onChange={e => upd('quote', e.target.value)}
                  rows={4}
                  placeholder="The honouree's quote..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button id="save-testimonial-btn" type="button" onClick={save} disabled={isProcessing} style={primaryBtn}>
                {isProcessing ? 'Processing...' : 'Save Testimonial'}
              </button>
              <button type="button" onClick={closeModal} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map(t => (
          <Card key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <img
                src={t.photo || '/news1.jpeg'}
                alt={t.name}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#e05a24', fontWeight: 600 }}>{t.nation}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.title}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontStyle: 'italic' }}>
              "{t.quote}"
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Btn size="sm" variant="ghost" onClick={() => openEdit(t)}>✏️ Edit</Btn>
              <Btn size="sm" variant="ghost" onClick={() => remove(t.id)} style={{ color: '#ff6b6b' }}>🗑 Remove</Btn>
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
