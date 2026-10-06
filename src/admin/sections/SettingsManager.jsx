import { useState } from 'react'
import { Card, PageHeader, Btn } from '../AdminUI'

const SOCIAL_META = {
  facebook:  { label: 'Facebook',    color: '#1877f2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  instagram: { label: 'Instagram',   color: '#e1306c', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  twitter:   { label: 'Twitter / X', color: '#1da1f2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
  youtube:   { label: 'YouTube',     color: '#ff0000', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
  linkedin:  { label: 'LinkedIn',    color: '#0a66c2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
}

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
    certNo:   'QMS/26M05315',
    certBy:   'MQA Certification Services',
    location: '130 Thessaly Rd, Nine Elms, London SW8 5EJ, UK',
    issued:   '18 July 2026',
    expiry:   '17 July 2029',
    accred:   'UKAF-CB-011 · UKAF CERT LIMITED',
  },
  registration: {
    actName:  'Societies Registration Act 35/2001',
    nature:   'Non-Profit · No Commercial Activity',
    finYear:  'April 1st — March 31st',
  },
}

import { useSiteSettings } from '../../utils/settingsStore'

const INIT_ADMINS = [
  { id: 1, username: 'admin',       role: 'Super Admin', email: 'admin@gif.org',   active: true },
  { id: 2, username: 'content_mgr', role: 'Content',     email: 'content@gif.org', active: true },
]

export default function SettingsManager() {
  const [settings, setSettings] = useSiteSettings()
  const [admins, setAdmins]     = useState(INIT_ADMINS)
  const [editing, setEditing]   = useState(null) // section key
  const [temp, setTemp]         = useState(null)
  const [adminModal, setAdminModal] = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const startEdit = (key) => { setEditing(key); setTemp({ ...settings[key] }) }
  const saveEdit  = () => { setSettings(p => ({ ...p, [editing]: temp })); setEditing(null); showToast('✓ Settings updated & live on site.') }

  const saveAdmin = () => {
    if (!adminModal.data.username.trim()) return
    if (adminModal.mode === 'add') { setAdmins(prev => [...prev, { ...adminModal.data, id: Date.now(), active: true }]); showToast('Admin added.') }
    else                           { setAdmins(prev => prev.map(a => a.id === adminModal.data.id ? adminModal.data : a)); showToast('Updated.') }
    setAdminModal(null)
  }

  const SECTIONS = [
    { key: 'contact',      label: 'Contact Details',   fields: [['Phone', 'phone'], ['Email', 'email'], ['Head Office (Hyderabad)', 'headOffice'], ['Registered Office (Vijayawada)', 'registeredOffice']] },
    { key: 'iso',          label: 'ISO Certification',  fields: [['Certificate No.', 'certNo'], ['Certified By', 'certBy'], ['Location', 'location'], ['Issue Date', 'issued'], ['Expiry Date', 'expiry'], ['Accreditation', 'accred']] },
    { key: 'registration', label: 'Registration Info',  fields: [['Act / Law', 'actName'], ['Nature', 'nature'], ['Financial Year', 'finYear']] },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide configuration" />
      {toast && <Toast msg={toast} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── CONTACT, ISO, REGISTRATION (generic grid) ── */}
        {SECTIONS.map(sec => (
          <Card key={sec.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{sec.label}</div>
              {editing === sec.key
                ? <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Btn id={`save-${sec.key}-btn`} size="sm" onClick={saveEdit}>Save</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
                  </div>
                : <Btn id={`edit-${sec.key}-btn`} size="sm" onClick={() => startEdit(sec.key)}>Edit</Btn>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {sec.fields.map(([label, key]) => (
                <div key={key}>
                  <div style={labelStyle}>{label}</div>
                  {editing === sec.key
                    ? <input id={`input-${sec.key}-${key}`} value={temp[key]} onChange={e => setTemp(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                    : <div style={{ fontSize: '0.85rem', color: '#fff', lineHeight: 1.5 }}>{settings[sec.key]?.[key]}</div>}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* ── SOCIAL MEDIA — dedicated clean layout ── */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Social Media Links</div>
            {editing === 'social'
              ? <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Btn id="save-social-btn" size="sm" onClick={saveEdit}>Save</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
                </div>
              : <Btn id="edit-social-btn" size="sm" onClick={() => startEdit('social')}>Edit</Btn>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {Object.entries(SOCIAL_META).map(([key, meta]) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                background: '#0e1e2c', borderRadius: 10, padding: '0.7rem 1rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {/* Platform icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${meta.color}22`,
                  border: `1px solid ${meta.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: meta.color,
                }}>
                  {meta.icon}
                </div>

                {/* Label */}
                <div style={{ width: 90, flexShrink: 0, fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                  {meta.label}
                </div>

                {/* URL / input */}
                {editing === 'social' ? (
                  <input
                    id={`input-social-${key}`}
                    value={temp[key]}
                    onChange={e => setTemp(p => ({ ...p, [key]: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, margin: 0 }}
                  />
                ) : (
                  <a href={settings.social?.[key]} target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, fontSize: '0.82rem', color: meta.color,
                      textDecoration: 'none', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {settings.social?.[key]}
                  </a>
                )}

                {/* Open link icon */}
                {editing !== 'social' && (
                  <a href={settings.social[key]} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Users */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Admin Users</div>
            <Btn size="sm" onClick={() => setAdminModal({ mode: 'add', data: { username: '', role: 'Content', email: '', password: '' } })}>Add Admin</Btn>
          </div>

          {adminModal && (
            <div style={overlayStyle}>
              <div style={modalStyle}>
                <div style={modalHeader}>
                  <span style={modalTitle}>{adminModal.mode === 'add' ? 'Add Admin' : 'Edit Admin'}</span>
                  <button onClick={() => setAdminModal(null)} style={closeBtn}>✕</button>
                </div>
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
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={saveAdmin} style={primaryBtn}>Save</button>
                  <button onClick={() => setAdminModal(null)} style={ghostBtn}>Cancel</button>
                </div>
              </div>
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
const modalStyle   = { width: '100%', maxWidth: 420, background: '#111c26', borderRadius: 14, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
const modalHeader  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }
const modalTitle   = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' }
const closeBtn     = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }
const primaryBtn   = { flex: 1, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#e05a24', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const ghostBtn     = { padding: '0.65rem 1.1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }
const inputStyle   = { width: '100%', padding: '0.6rem 0.85rem', background: '#1a2636', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }
const labelStyle   = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }
function Toast({ msg }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a3a2a', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999 }}>{msg}</div> }
