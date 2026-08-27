import { useState } from 'react'
import { Card, PageHeader, Btn } from '../AdminUI'

const INIT = {
  contact: {
    phone: '+91 98765 43210',
    email: 'info@globaliconsforumsociety.org',
    address: 'Global Icons Forum Society, 24-29-211, Durga Puram, Gulabi Thota Road, J Apparao Street, Vijayawada 520003, Andhra Pradesh',
  },
  social: {
    facebook:  'https://facebook.com/globaliconsforumsociety',
    instagram: 'https://instagram.com/globaliconsforumsociety',
    twitter:   'https://twitter.com/globaliconsGIF',
    youtube:   'https://youtube.com/@globaliconsforumsociety',
    linkedin:  'https://linkedin.com/company/globaliconsforumsociety',
  },
  iso: {
    certNo:     'QMS/26M05315',
    certBy:     'MQA Certification Services',
    location:   '130 Thessaly Rd, Nine Elms, London SW8 5EJ, UK',
    issued:     '18 July 2026',
    expiry:     '17 July 2029',
    accred:     'UKAF-CB-011 · UKAF CERT LIMITED',
  },
  registration: {
    actName:    'Societies Registration Act 35/2001',
    nature:     'Non-Profit · No Commercial Activity',
    finYear:    'April 1st — March 31st',
  },
}

const INIT_ADMINS = [
  { id: 1, username: 'admin',       role: 'Super Admin', email: 'admin@gif.org',   active: true },
  { id: 2, username: 'content_mgr', role: 'Content',     email: 'content@gif.org', active: true },
]

export default function SettingsManager() {
  const [settings, setSettings] = useState(INIT)
  const [admins, setAdmins]     = useState(INIT_ADMINS)
  const [editing, setEditing]   = useState(null) // section key
  const [temp, setTemp]         = useState(null)
  const [adminModal, setAdminModal] = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const startEdit = (key) => { setEditing(key); setTemp({ ...settings[key] }) }
  const saveEdit  = () => { setSettings(p => ({ ...p, [editing]: temp })); setEditing(null); showToast('Saved.') }

  const saveAdmin = () => {
    if (!adminModal.data.username.trim()) return
    if (adminModal.mode === 'add') { setAdmins(prev => [...prev, { ...adminModal.data, id: Date.now(), active: true }]); showToast('Admin added.') }
    else                           { setAdmins(prev => prev.map(a => a.id === adminModal.data.id ? adminModal.data : a)); showToast('Updated.') }
    setAdminModal(null)
  }

  const SECTIONS = [
    { key: 'contact',      icon: '📞', label: 'Contact Details',   fields: [['Phone', 'phone'], ['Email', 'email'], ['Address', 'address']] },
    { key: 'social',       icon: '🔗', label: 'Social Media Links', fields: [['Facebook', 'facebook'], ['Instagram', 'instagram'], ['Twitter / X', 'twitter'], ['YouTube', 'youtube'], ['LinkedIn', 'linkedin']] },
    { key: 'iso',          icon: '🏅', label: 'ISO Certification',  fields: [['Certificate No.', 'certNo'], ['Certified By', 'certBy'], ['Location', 'location'], ['Issue Date', 'issued'], ['Expiry Date', 'expiry'], ['Accreditation', 'accred']] },
    { key: 'registration', icon: '📄', label: 'Registration Info',  fields: [['Act / Law', 'actName'], ['Nature', 'nature'], ['Financial Year', 'finYear']] },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide configuration" />
      {toast && <Toast msg={toast} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {SECTIONS.map(sec => (
          <Card key={sec.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>{sec.icon} {sec.label}</div>
              {editing === sec.key
                ? <div style={{ display: 'flex', gap: '0.5rem' }}><Btn size="sm" onClick={saveEdit}>Save</Btn><Btn size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn></div>
                : <Btn size="sm" onClick={() => startEdit(sec.key)}>✏️ Edit</Btn>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {sec.fields.map(([label, key]) => (
                <div key={key}>
                  <div style={labelStyle}>{label}</div>
                  {editing === sec.key
                    ? <input value={temp[key]} onChange={e => setTemp(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                    : <div style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.5 }}>{settings[sec.key][key]}</div>}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Admin Users */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#fff' }}>👤 Admin Users</div>
            <Btn size="sm" onClick={() => setAdminModal({ mode: 'add', data: { username: '', role: 'Content', email: '', password: '' } })}>+ Add Admin</Btn>
          </div>

          {adminModal && (
            <div style={overlayStyle}>
              <Card style={{ maxWidth: 420, width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>{adminModal.mode === 'add' ? 'Add Admin' : 'Edit Admin'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[['Username', 'username', 'text'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([label, key, type]) => (
                    <div key={key}><label style={labelStyle}>{label}</label><input type={type} value={adminModal.data[key] || ''} onChange={e => setAdminModal(p => ({ ...p, data: { ...p.data, [key]: e.target.value } }))} style={inputStyle} /></div>
                  ))}
                  <div><label style={labelStyle}>Role</label>
                    <select value={adminModal.data.role} onChange={e => setAdminModal(p => ({ ...p, data: { ...p.data, role: e.target.value } }))} style={inputStyle}>
                      {['Super Admin', 'Content', 'Moderator'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <Btn onClick={saveAdmin}>Save</Btn>
                  <Btn variant="ghost" onClick={() => setAdminModal(null)}>Cancel</Btn>
                </div>
              </Card>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {admins.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.85rem 1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#e05a24,#0f7ea3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.85rem', flexShrink: 0 }}>{a.username[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{a.username}</div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)' }}>{a.email} · {a.role}</div>
                </div>
                <Btn size="sm" onClick={() => setAdminModal({ mode: 'edit', data: { ...a, password: '' } })}>✏️</Btn>
                <Btn size="sm" variant="danger" onClick={() => { setAdmins(prev => prev.filter(x => x.id !== a.id)); showToast('Admin removed.') }}>🗑</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
