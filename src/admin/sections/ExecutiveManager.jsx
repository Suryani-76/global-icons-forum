import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'
import { useExecutiveMembers } from '../../utils/executiveStore'
import { processImageFile } from '../../utils/imageProcessor'

const DESIGNATIONS = ['President', 'Vice-President', 'Secretary', 'Joint Secretary', 'Treasurer', 'Member']
const blank = { name: '', designation: 'Member', photo: '' }

export default function ExecutiveManager() {
  const [members, setMembers] = useExecutiveMembers()
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState('')
  const [photoMode, setPhotoMode] = useState('upload') // Default to upload mode
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const openAdd  = () => {
    setPhotoMode('upload')
    setUploadError('')
    setModal({ mode: 'add', data: { ...blank, id: Date.now() } })
  }
  const openEdit = (m) => {
    setPhotoMode(m.photo?.startsWith('data:') ? 'upload' : 'url')
    setUploadError('')
    setModal({ mode: 'edit', data: { ...m } })
  }

  const handleSelectedFile = async (file) => {
    if (!file) return
    setUploadError('')
    setIsProcessing(true)

    try {
      const result = await processImageFile(file, 800, 0.88)
      setModal(p => ({ ...p, data: { ...p.data, photo: result.dataUrl } }))
    } catch (err) {
      console.error('Executive photo error:', err)
      setUploadError(err.message || 'Failed to process image. Please try another file.')
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
    const name = modal.data.name.trim() || document.querySelector('#exec-name-input')?.value?.trim() || ''
    if (!name) {
      setUploadError('Please enter member name.')
      return
    }
    const finalData = { ...modal.data, name }
    if (modal.mode === 'add') {
      setMembers(prev => [...prev, finalData])
      showToast('✓ Member added & saved.')
    } else {
      setMembers(prev => prev.map(m => m.id === modal.data.id ? finalData : m))
      showToast('✓ Member updated.')
    }
    setModal(null)
  }

  const remove = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    showToast('Member removed.')
  }

  return (
    <div>
      <PageHeader title="Executive Body" subtitle={`${members.length} members`}>
        <Btn id="add-exec-btn" onClick={openAdd}>+ Add Member</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle} onClick={() => { setModal(null); setIsProcessing(false) }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Member' : 'Edit Member'}</span>
              <button type="button" onClick={() => { setModal(null); setIsProcessing(false) }} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Full Name">
                <input
                  id="exec-name-input"
                  value={modal.data.name}
                  onChange={e => setModal(p => ({ ...p, data: { ...p.data, name: e.target.value } }))}
                  style={inputStyle}
                  placeholder="e.g. Mr. Rajan Kumar"
                  autoFocus
                />
              </Field>
              <Field label="Designation">
                <select
                  id="exec-designation-select"
                  value={modal.data.designation}
                  onChange={e => setModal(p => ({ ...p, data: { ...p.data, designation: e.target.value } }))}
                  style={inputStyle}
                >
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Photo">
                {/* Mode toggle */}
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

                {uploadError && (
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: 6, background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7676', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                    ⚠️ {uploadError}
                  </div>
                )}

                {photoMode === 'url' && (
                  <input
                    id="exec-photo-url"
                    value={modal.data.photo}
                    onChange={e => setModal(p => ({ ...p, data: { ...p.data, photo: e.target.value } }))}
                    style={inputStyle}
                    placeholder="/exec-name.jpeg or https://..."
                  />
                )}

                {photoMode === 'upload' && (
                  <>
                    <input
                      id="exec-file-input"
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
                        ? '⏳ Optimizing image...'
                        : modal.data.photo
                          ? '✓ Photo selected (click or drop to change)'
                          : 'Click to choose image or drag & drop'}
                    </div>
                  </>
                )}
              </Field>

              {modal.data.photo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={modal.data.photo}
                    alt=""
                    onError={() => setUploadError('Image failed to load')}
                    style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: '#0a1017' }}
                  />
                  <button
                    type="button"
                    onClick={() => setModal(p => ({ ...p, data: { ...p.data, photo: '' } }))}
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button id="save-exec-btn" type="button" onClick={save} disabled={isProcessing} style={primaryBtn}>
                {isProcessing ? 'Processing...' : 'Save'}
              </button>
              <button type="button" onClick={() => { setModal(null); setIsProcessing(false) }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {members.map(m => (
          <Card key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={m.photo || '/president.jpg'}
                alt={m.name}
                style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', background: '#0a1017' }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                <Badge color={m.designation === 'President' ? '#e05a24' : m.designation === 'Secretary' ? '#9b59b6' : '#0f7ea3'}>{m.designation}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <Btn size="sm" onClick={() => openEdit(m)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => remove(m.id)}>Remove</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 440, background: '#111c26', borderRadius: 14, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
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
