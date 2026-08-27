import { useState } from 'react'
import { Card, PageHeader, Btn, Badge } from '../AdminUI'

const STATUSES = ['Pending', 'Shortlisted', 'Approved', 'Rejected']
const statusColor = { Pending: '#f7c430', Shortlisted: '#5ec8e8', Approved: '#2ecc71', Rejected: '#ff6b6b' }

const SAMPLE = [
  { id: 1,  name: 'Dr. Arjun Reddy',      email: 'arjun@example.com',   category: 'Business & Entrepreneurship', date: '2026-07-10', status: 'Pending',     message: 'Founder of 3 successful startups across India and UAE.' },
  { id: 2,  name: 'Ms. Preethi Nair',     email: 'preethi@example.com', category: 'Arts & Culture',               date: '2026-07-12', status: 'Shortlisted', message: 'Award-winning classical dancer and choreographer.' },
  { id: 3,  name: 'Mr. Vinod Sharma',     email: 'vinod@example.com',   category: 'Social Impact',                date: '2026-07-14', status: 'Approved',    message: 'Runs 12 rural schools across Rajasthan.' },
  { id: 4,  name: 'Dr. Meena Iyer',       email: 'meena@example.com',   category: 'Health & Medicine',            date: '2026-07-15', status: 'Pending',     message: 'Pioneer in telemedicine for remote villages.' },
  { id: 5,  name: 'Mr. Farhan Qureshi',   email: 'farhan@example.com',  category: 'Science & Technology',         date: '2026-07-16', status: 'Rejected',    message: 'AI researcher at IIT Bombay.' },
  { id: 6,  name: 'Ms. Sudha Krishnan',   email: 'sudha@example.com',   category: 'Education',                    date: '2026-07-17', status: 'Pending',     message: 'Established literacy programs for 10,000+ women.' },
  { id: 7,  name: 'Mr. Ravi Teja Bolli',  email: 'ravi@example.com',    category: 'Sports',                       date: '2026-07-18', status: 'Shortlisted', message: 'National-level kabaddi champion.' },
  { id: 8,  name: 'Dr. Leela Anand',      email: 'leela@example.com',   category: 'Diplomacy & Peace',            date: '2026-07-19', status: 'Pending',     message: 'Peace ambassador for South Asian dialogue forums.' },
]

export default function NominationsManager() {
  const [items, setItems]       = useState(SAMPLE)
  const [statusFilter, setStatusFilter] = useState('All')
  const [catFilter, setCatFilter]       = useState('All')
  const [selected, setSelected] = useState(null)
  const [emailModal, setEmailModal] = useState(null)
  const [emailText, setEmailText]   = useState('')
  const [toast, setToast]           = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateStatus = (id, status) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
    showToast(`Status updated to ${status}`)
  }

  const sendEmail = () => {
    showToast(`Email sent to ${emailModal.email}`)
    setEmailModal(null); setEmailText('')
  }

  const categories = ['All', ...new Set(SAMPLE.map(i => i.category))]
  const filtered = items
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .filter(i => catFilter    === 'All' || i.category === catFilter)

  // CSV export
  const exportCSV = () => {
    const header = 'Name,Email,Category,Date,Status'
    const rows   = filtered.map(i => `"${i.name}","${i.email}","${i.category}","${i.date}","${i.status}"`)
    const blob   = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a'); a.href = url; a.download = 'nominations.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader title="Nominations" subtitle={`${filtered.length} of ${items.length} submissions`}>
        <Btn variant="ghost" onClick={exportCSV}>⬇ Export CSV</Btn>
      </PageHeader>
      {toast && <Toast msg={toast} />}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={labelStyle}>Status</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', ...STATUSES].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '0.35rem 0.85rem', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)',
                background: statusFilter === s ? 'rgba(224,90,36,0.2)' : 'rgba(255,255,255,0.05)',
                color: statusFilter === s ? '#e05a24' : 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inputStyle, width: 220 }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Email modal */}
      {emailModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeader}>
              <span style={modalTitle}>Send Email</span>
              <button onClick={() => setEmailModal(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>To: {emailModal.email}</div>
            <textarea value={emailText} onChange={e => setEmailText(e.target.value)} rows={6} placeholder="Type your message..." style={{ ...inputStyle, width: '100%', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={sendEmail} style={primaryBtn}>Send</button>
              <button onClick={() => setEmailModal(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail panel + list */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(item => (
            <Card key={item.id} style={{ cursor: 'pointer', border: selected?.id === item.id ? '1px solid #e05a24' : undefined }}
              onClick={() => setSelected(item)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>{item.email} · {item.date}</div>
                  <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Badge>{item.category}</Badge>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor[item.status] }}>● {item.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setEmailModal(item) }}>📧</Btn>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem', fontSize: '0.9rem' }}>No submissions match the filters.</div>}
        </div>

        {selected && (
          <Card style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>Details</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['Name', selected.name], ['Email', selected.email], ['Category', selected.category], ['Date', selected.date]].map(([k, v]) => (
                <div key={k}><div style={labelStyle}>{k}</div><div style={{ fontSize: '0.88rem', color: '#fff' }}>{v}</div></div>
              ))}
              <div><div style={labelStyle}>Message</div><div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{selected.message}</div></div>
              <div><div style={labelStyle}>Status</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                      padding: '0.3rem 0.7rem', borderRadius: 6, border: '1px solid',
                      borderColor: selected.status === s ? statusColor[s] : 'rgba(255,255,255,0.15)',
                      background: selected.status === s ? `${statusColor[s]}22` : 'none',
                      color: selected.status === s ? statusColor[s] : 'rgba(255,255,255,0.4)',
                      fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <Btn onClick={() => setEmailModal(selected)}>📧 Send Email</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const modalStyle   = { width: '100%', maxWidth: 480, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.83rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
