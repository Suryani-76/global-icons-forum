import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useGalleryImages } from '../../utils/galleryStore'
import { processImageFile } from '../../utils/imageProcessor'

export default function GalleryManager() {
  const [images, setImages, resetToDefaults] = useGalleryImages()
  const [editing, setEditing]       = useState(null)
  const [addModal, setAddModal]     = useState(false)
  const [newUrl, setNewUrl]         = useState('')
  const [newCaption, setNewCaption] = useState('Global Icons Forum — Event')
  const [preview, setPreview]       = useState(null)
  const [previewInfo, setPreviewInfo] = useState(null) // { size, width, height }
  const [addMode, setAddMode]       = useState('upload') // Default to upload mode
  const [toast, setToast]           = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const [isDragging, setIsDragging]     = useState(false)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const deleteImg = (id) => {
    setImages(prev => prev.filter(i => i.id !== id))
    showToast('Photo removed from gallery.')
  }

  const saveCaption = () => {
    if (!editing) return
    setImages(prev => prev.map(i => i.id === editing.id ? { ...i, caption: editing.caption } : i))
    setEditing(null)
    showToast('Caption updated.')
  }

  const moveUp = (idx) => {
    if (idx === 0) return
    const a = [...images]
    ;[a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]
    setImages(a)
  }

  const moveDown = (idx) => {
    if (idx === images.length - 1) return
    const a = [...images]
    ;[a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]
    setImages(a)
  }

  // Safe file processor
  const handleSelectedFile = async (file) => {
    if (!file) return
    setUploadError('')
    setIsProcessing(true)

    try {
      const result = await processImageFile(file)
      setPreview(result.dataUrl)
      setPreviewInfo({
        size: result.size ? `${(result.size / 1024).toFixed(1)} KB` : '',
        dimensions: result.width && result.height ? `${result.width}×${result.height}px` : '',
      })
      if (!newCaption || newCaption === 'Global Icons Forum — Event') {
        setNewCaption(result.name || 'Global Icons Forum — Event')
      }
    } catch (err) {
      console.error('File upload error:', err)
      setUploadError(err.message || 'Failed to process image. Please try another image file.')
      setPreview(null)
      setPreviewInfo(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    handleSelectedFile(file)
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleSelectedFile(file)
  }

  const closeAdd = () => {
    setAddModal(false)
    setIsProcessing(false)
    setUploadError('')
    setPreview(null)
    setPreviewInfo(null)
    setNewUrl('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const openAdd = () => {
    setNewUrl('')
    setNewCaption('Global Icons Forum — Event')
    setPreview(null)
    setPreviewInfo(null)
    setUploadError('')
    setIsProcessing(false)
    setAddMode('upload')
    setAddModal(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  const confirmAdd = () => {
    const src = addMode === 'upload' ? preview : newUrl.trim()
    if (!src) {
      setUploadError('Please choose an image file or enter an image URL.')
      return
    }
    const newPhoto = {
      id: Date.now(),
      src,
      caption: newCaption.trim() || 'Global Icons Forum — Event',
    }
    setImages(prev => [newPhoto, ...prev])
    closeAdd()
    showToast('✓ Photo uploaded and added to live website gallery!')
  }

  return (
    <div>
      <PageHeader title="Gallery Manager" subtitle={`${images.length} photos published on live site`}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Btn variant="ghost" size="sm" onClick={() => {
            if (confirm('Reset gallery to default original event photos?')) {
              resetToDefaults()
              showToast('Gallery restored to defaults.')
            }
          }}>
            ↺ Reset Defaults
          </Btn>
          <Btn onClick={openAdd}>+ Add Photo</Btn>
        </div>
      </PageHeader>

      {toast && <Toast msg={toast} />}

      {/* ── ADD MODAL ── */}
      {addModal && (
        <div style={overlayStyle} onClick={closeAdd}>
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#111c26',
              borderRadius: 16,
              padding: '2rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Upload Photo to Gallery</span>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0.2rem 0 0' }}>
                  Images will appear on the public website and admin portal
                </p>
              </div>
              <button
                type="button"
                onClick={closeAdd}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', background: '#1a2636', borderRadius: 8, padding: 3, marginBottom: '1.25rem' }}>
              {[['upload', 'Upload File / Drag & Drop'], ['url', 'Paste Web URL']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setAddMode(id)
                    setUploadError('')
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: 'none',
                    background: addMode === id ? '#e05a24' : 'transparent',
                    color: addMode === id ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Error Message Alert */}
            {uploadError && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                background: 'rgba(255,80,80,0.12)',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff7676',
                fontSize: '0.8rem',
                lineHeight: 1.4,
              }}>
                ⚠️ {uploadError}
              </div>
            )}

            {/* Upload Mode */}
            {addMode === 'upload' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Image File</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif, image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (isProcessing) return
                    if (fileRef.current) {
                      fileRef.current.value = '' // Allow selecting same file again
                      fileRef.current.click()
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '1.75rem 1rem',
                    border: `2px dashed ${isDragging ? '#e05a24' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: 10,
                    background: isDragging ? 'rgba(224,90,36,0.08)' : 'rgba(255,255,255,0.02)',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                >
                  {isProcessing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="loader-ring" style={{ width: 28, height: 28 }} />
                      <span style={{ fontSize: '0.85rem', color: '#e05a24', fontWeight: 600 }}>
                        Optimizing and processing image...
                      </span>
                    </div>
                  ) : preview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#2ecc71', fontSize: '1.1rem' }}>✓</span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                        Image Loaded Successfully
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>
                        Click or drag another image to replace
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.6rem' }}>📁</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                        Click to browse or drag & drop photo
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        Supports JPG, PNG, WebP, GIF (auto-optimized)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL Mode */}
            {addMode === 'url' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Image URL</label>
                <input
                  value={newUrl}
                  onChange={e => {
                    setNewUrl(e.target.value)
                    setPreview(e.target.value.trim())
                    setUploadError('')
                  }}
                  placeholder="/gallery14.jpeg or https://..."
                  style={inputStyle}
                  autoFocus
                />
              </div>
            )}

            {/* Preview Section */}
            {preview && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Preview</label>
                  {previewInfo && (
                    <span style={{ fontSize: '0.7rem', color: '#2ecc71' }}>
                      {previewInfo.dimensions} {previewInfo.size ? `(${previewInfo.size})` : ''}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img
                    src={preview}
                    alt="preview"
                    onError={() => {
                      setUploadError('Failed to display image preview. Please check file format.')
                    }}
                    style={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      display: 'block',
                      background: '#0a1017',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null)
                      setPreviewInfo(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      color: '#ff6b6b',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Remove preview"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Caption */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Caption / Title</label>
              <input
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
                placeholder="e.g. State Icons Awards Night 2026"
                style={inputStyle}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={confirmAdd}
                disabled={isProcessing || !preview}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 8,
                  border: 'none',
                  background: (!preview || isProcessing) ? 'rgba(224,90,36,0.35)' : '#e05a24',
                  color: (!preview || isProcessing) ? 'rgba(255,255,255,0.45)' : '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: (!preview || isProcessing) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {isProcessing ? 'Processing...' : 'Add to Live Gallery'}
              </button>
              <button
                type="button"
                onClick={closeAdd}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT CAPTION MODAL ── */}
      {editing && (
        <div style={overlayStyle} onClick={() => setEditing(null)}>
          <Card style={{ maxWidth: 420, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Edit Photo Caption</div>
            <img src={editing.src} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem', display: 'block' }} />
            <input
              value={editing.caption}
              onChange={e => setEditing(p => ({ ...p, caption: e.target.value }))}
              style={inputStyle}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Btn onClick={saveCaption}>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {images.map((img, idx) => (
          <Card key={img.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={img.src}
                alt={img.caption}
                style={{ width: '100%', height: 155, objectFit: 'cover', display: 'block', background: '#0a1017' }}
              />
              <div style={{ position: 'absolute', top: 6, left: 6 }}>
                <Badge>{idx + 1}</Badge>
              </div>
            </div>
            <div style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', lineHeight: 1.4, minHeight: '2.2em' }}>
                {img.caption}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Btn size="sm" onClick={() => setEditing(img)}>✏️ Edit</Btn>
                <Btn size="sm" variant="ghost" onClick={() => moveUp(idx)} disabled={idx === 0}>↑</Btn>
                <Btn size="sm" variant="ghost" onClick={() => moveDown(idx)} disabled={idx === images.length - 1}>↓</Btn>
                <Btn size="sm" variant="danger" onClick={() => deleteImg(img.id)}>🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
const inputStyle   = { width: '100%', padding: '0.75rem 0.9rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }

function Toast({ msg }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: '#0d2818',
      border: '1px solid #2ecc71',
      color: '#2ecc71',
      borderRadius: 10,
      padding: '0.85rem 1.35rem',
      fontSize: '0.88rem',
      fontWeight: 600,
      zIndex: 9999,
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      {msg}
    </div>
  )
}
