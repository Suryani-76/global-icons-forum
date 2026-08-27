// Shared primitive UI components for the admin portal

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: '1.25rem',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>{title}</h2>
        {subtitle && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
      {children && <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{children}</div>}
    </div>
  )
}

const variants = {
  primary: { bg: 'linear-gradient(135deg,#b94000,#e05a24)', color: '#fff', border: 'none' },
  ghost:   { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.15)' },
  danger:  { bg: 'rgba(255,80,80,0.12)', color: '#ff8080', border: '1px solid rgba(255,80,80,0.25)' },
}

const sizes = {
  default: { padding: '0.55rem 1.1rem', fontSize: '0.85rem', borderRadius: 8 },
  sm:      { padding: '0.3rem 0.7rem',  fontSize: '0.75rem', borderRadius: 6 },
}

export function Btn({ children, onClick, variant = 'primary', size = 'default', style = {}, ...props }) {
  const v = variants[variant]
  const s = sizes[size]
  return (
    <button onClick={onClick} {...props} style={{
      background: v.bg, color: v.color, border: v.border,
      padding: s.padding, fontSize: s.fontSize, borderRadius: s.borderRadius,
      fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'opacity 0.2s', ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
  )
}

export function Badge({ children, color = '#0f7ea3' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '0.15rem 0.55rem',
      borderRadius: 20, fontSize: '0.65rem', fontWeight: 700,
      background: `${color}22`, color: color,
      border: `1px solid ${color}44`, letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}
