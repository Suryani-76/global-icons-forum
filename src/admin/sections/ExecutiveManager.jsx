import { useState, useRef } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const DESIGNATIONS = ['President', 'Vice-President', 'Secretary', 'Joint Secretary', 'Treasurer', 'Member']

const INIT = [
  { id: 1, name: 'Mr. Chaitanya Janga',           designation: 'President',       photo: '/president.jpg' },
  { id: 2, name: 'Mrs. Jaya Pateriya',             designation: 'Secretary',       photo: '/exec-jaya-pateriya.jpeg' },
  { id: 3, name: 'Mr. Mithana Eswara Rao',         designation: 'Vice-President',  photo: '/gallery21.jpeg' },
  { id: 4, name: 'Mr. Kode Sri Chaitanya',         designation: 'Joint Secretary', photo: '/gallery22.jpeg' },
  { id: 5, name: 'Mr. Ramisetty Venkata Apparao',  designation: 'Treasurer',       photo: '/exec-ramisetty.jpeg' },
  { id: 6, name: 'Dr. Animelli Naveen',            designation: 'Member',          photo: '/exec-animelli-naveen.jpeg' },
  { id: 7, name: 'Mr. Battula Dhanista',           designation: 'Member',          photo: '/exec-battula.jpeg' },
  { id: 8, name: 'Mr. Emmanuel',                   designation: 'Member',          photo: '/exec-emmanuel.jpeg' },
  { id: 9, name: 'Mr. Syed Ghouseuddin',           designation: 'Member',          photo: '/exec-syed.jpeg' },
]

const blank = { name: '', designation: 'Member', photo: '' }

export default function ExecutiveManager() {
  const [members, setMembers] = useState(INIT)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState('')
  const [photoMode, setPhotoMode] = useState('url') // 'url' | 'upload'
  const fileRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const openAdd  = () => { setPhotoMode('url'); setModal({ mode: 'add',  data: { ...blank, id: Date.now() } }) }
  const openEdit = (m) => { setPhotoMode('url'); setModal({ mode: 'edit', data: { ...m } }) }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setModal(p => ({ ...p, data: { ...p.data, photo: ev.target.result } }))
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!modal.data.name.trim()) return
    if (modal.mode === 'add') { setMembers(prev => [...prev, modal.data]); showToast('Member added.') }
    else                      { setMembers(prev => prev.map(m => m.id === modal.data.id ? modal.data : m)); showToast('Member updated.') }
    setModal(null)
  }
  const remove = (id) => { setMembers(prev => prev.filter(m => m.id !== id)); showToast('Member removed.') }

  return (
    <div>
      <PageHeader title="Executive Body" subtitle={`${members.length} members`}>
        <Btn onClick={openAdd}>Add Member</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {modal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeader}>
              <span style={modalTitle}>{modal.mode === 'add' ? 'Add Member' : 'Edit Member'}</span>
              <button onClick={() => setModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Full Name">
                <input value={modal.data.name} onChange={e => setModal(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} style={inputStyle} placeholder="e.g. Mr. Rajan Kumar" autoFocus />
              </Field>
              <Field label="Designation">
                <select value={modal.data.designation} onChange={e => setModal(p => ({ ...p, data: { ...p.data, designation: e.target.value } }))} style={inputStyle}>
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Photo">
                {/* Mode toggle */}
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
                  <input value={modal.data.photo} onChange={e => setModal(p => ({ ...p, data: { ...p.data, photo: e.target.value } }))} style={inputStyle} placeholder="/exec-name.jpeg" />
                )}
                {photoMode === 'upload' && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileRef.current.click()} style={{
                      width: '100%', padding: '1.1rem', border: '1.5px dashed rgba(255,255,255,0.15)',
                      borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', fontSize: '0.82rem', boxSizing: 'border-box',
                    }}>
                      {modal.data.photo?.startsWith('data:') ? '✓ File selected' : 'Click to choose image'}
                    </button>
                  </>
                )}
              </Field>
              {modal.data.photo && (
                <img src={modal.data.photo} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={primaryBtn}>Save</button>
              <button onClick={() => setModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {members.map(m => (
          <Card key={m.id}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.85rem' }}>
              <img src={m.photo} alt={m.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', lineHeight: 1.3 }}>{m.name}</div>
                <Badge color="#e05a24">{m.designation}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
  return <div><label style={labelStyle}>{label}</label>{children}</div>
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 420, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0d2218', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 8, padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
