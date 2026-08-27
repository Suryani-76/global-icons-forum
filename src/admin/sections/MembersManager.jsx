import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const STATUSES = ['Active', 'Pending', 'Rejected']
const statusColor = { Active: '#2ecc71', Pending: '#f7c430', Rejected: '#ff6b6b' }

const SAMPLE_MEMBERS = [
  { id: 1,  name: 'Mr. Ravi Kumar',     email: 'ravi@example.com',   city: 'Hyderabad',   country: 'India',     joined: '2025-01-10', status: 'Active' },
  { id: 2,  name: 'Ms. Anita Sharma',   email: 'anita@example.com',  city: 'Mumbai',      country: 'India',     joined: '2025-02-14', status: 'Active' },
  { id: 3,  name: 'Mr. James Okonkwo',  email: 'james@example.com',  city: 'Lagos',       country: 'Nigeria',   joined: '2025-03-05', status: 'Pending' },
  { id: 4,  name: 'Dr. Liu Wei',        email: 'liu@example.com',    city: 'Beijing',     country: 'China',     joined: '2025-04-20', status: 'Active' },
  { id: 5,  name: 'Ms. Sara Al-Amri',   email: 'sara@example.com',   city: 'Dubai',       country: 'UAE',       joined: '2025-05-11', status: 'Pending' },
  { id: 6,  name: 'Mr. Pedro Costa',    email: 'pedro@example.com',  city: 'Sao Paulo',   country: 'Brazil',    joined: '2025-06-03', status: 'Rejected' },
]

const SAMPLE_CHAPTERS = [
  { id: 1, city: 'Vijayawada', country: 'India',     contact: 'Mr. Chaitanya Janga',  email: 'vijayawada@gif.org',  members: 45, status: 'Active' },
  { id: 2, city: 'Hyderabad',  country: 'India',     contact: 'Mr. Ravi Kumar',        email: 'hyderabad@gif.org',   members: 38, status: 'Active' },
  { id: 3, city: 'Mumbai',     country: 'India',     contact: 'Ms. Anita Sharma',      email: 'mumbai@gif.org',      members: 27, status: 'Active' },
  { id: 4, city: 'Dubai',      country: 'UAE',       contact: 'Ms. Sara Al-Amri',      email: 'dubai@gif.org',       members: 14, status: 'Pending' },
  { id: 5, city: 'London',     country: 'UK',        contact: 'Mr. Emmanuel',          email: 'london@gif.org',      members: 9,  status: 'Active' },
]

const blankChapter = { city: '', country: '', contact: '', email: '', members: 0, status: 'Active' }

export default function MembersManager() {
  const [tab, setTab]               = useState('members')
  const [members, setMembers]       = useState(SAMPLE_MEMBERS)
  const [chapters, setChapters]     = useState(SAMPLE_CHAPTERS)
  const [chapterModal, setChapterModal] = useState(null)
  const [toast, setToast]           = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateMemberStatus = (id, status) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    showToast(`Member ${status.toLowerCase()}.`)
  }

  const saveChapter = () => {
    if (!chapterModal.data.city.trim()) return
    if (chapterModal.mode === 'add') { setChapters(prev => [...prev, { ...chapterModal.data, id: Date.now() }]); showToast('Chapter added.') }
    else                             { setChapters(prev => prev.map(c => c.id === chapterModal.data.id ? chapterModal.data : c)); showToast('Updated.') }
    setChapterModal(null)
  }

  const upd = (k, v) => setChapterModal(p => ({ ...p, data: { ...p.data, [k]: v } }))

  return (
    <div>
      <PageHeader title="Members & Chapters" subtitle={`${members.length} members · ${chapters.length} chapters`}>
        {tab === 'chapters' && <Btn onClick={() => setChapterModal({ mode: 'add', data: { ...blankChapter, id: Date.now() } })}>+ Add Chapter</Btn>}
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* Tab switch */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['members', '👥 Members'], ['chapters', '🌐 Chapters']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '0.5rem 1.25rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            background: tab === id ? 'rgba(224,90,36,0.2)' : 'rgba(255,255,255,0.05)',
            color: tab === id ? '#e05a24' : 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* Chapter modal */}
      {chapterModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeader}>
              <span style={modalTitle}>{chapterModal.mode === 'add' ? 'Add Chapter' : 'Edit Chapter'}</span>
              <button onClick={() => setChapterModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[['City', 'city'], ['Country', 'country'], ['Contact Person', 'contact'], ['Email', 'email']].map(([label, key]) => (
                <div key={key}><label style={labelStyle}>{label}</label><input value={chapterModal.data[key]} onChange={e => upd(key, e.target.value)} style={inputStyle} /></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={saveChapter} style={primaryBtn}>Save</button>
              <button onClick={() => setChapterModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {members.map(m => (
            <Card key={m.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e05a24,#0f7ea3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {m.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{m.email} · {m.city}, {m.country} · Joined {m.joined}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor[m.status] }}>● {m.status}</span>
                  {m.status === 'Pending' && <>
                    <Btn size="sm" onClick={() => updateMemberStatus(m.id, 'Active')}>✓ Approve</Btn>
                    <Btn size="sm" variant="danger" onClick={() => updateMemberStatus(m.id, 'Rejected')}>✕ Reject</Btn>
                  </>}
                  {m.status === 'Active' && <Btn size="sm" variant="ghost" onClick={() => updateMemberStatus(m.id, 'Rejected')}>Revoke</Btn>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'chapters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {chapters.map(ch => (
            <Card key={ch.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{ch.city}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{ch.country}</div>
                </div>
                <Badge color={ch.status === 'Active' ? '#2ecc71' : '#f7c430'}>{ch.status}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.85rem' }}>
                {[['Contact', ch.contact], ['Email', ch.email], ['Members', ch.members]].map(([k, v]) => (
                  <div key={k} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}><span style={{ color: 'rgba(255,255,255,0.3)' }}>{k}: </span>{v}</div>
                ))}
              </div>
              <Btn size="sm" onClick={() => setChapterModal({ mode: 'edit', data: { ...ch } })}>✏️ Edit</Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 440, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.65rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
