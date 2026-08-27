import { useState } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'gif@2025'

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr]   = useState('')
  const [show, setShow] = useState(false)

  const handle = (e) => {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin()
    } else {
      setErr('Invalid username or password.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #061824 0%, #0d2d3f 50%, #061824 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20, padding: '2.5rem',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Global Icons Forum" style={{ height: 56, marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>Admin Portal</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>Global Icons Forum Society</div>
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username"
              autoComplete="username" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password"
                type={show ? 'text' : 'password'} autoComplete="current-password" style={{ ...inputStyle, paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.8rem' }}>
                {show ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {err && <div style={{ fontSize: '0.82rem', color: '#ff6b6b', background: 'rgba(255,100,100,0.1)', borderRadius: 8, padding: '0.6rem 1rem', border: '1px solid rgba(255,100,100,0.25)' }}>{err}</div>}

          <button type="submit" style={{
            marginTop: '0.5rem', padding: '0.85rem', borderRadius: 10,
            background: 'linear-gradient(135deg, #b94000, #e05a24)',
            color: '#fff', fontWeight: 800, fontSize: '0.95rem',
            border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
            boxShadow: '0 4px 20px rgba(224,90,36,0.4)',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
          Restricted access — authorised personnel only
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em',
  textTransform: 'uppercase', marginBottom: '0.4rem',
}
const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box',
}
