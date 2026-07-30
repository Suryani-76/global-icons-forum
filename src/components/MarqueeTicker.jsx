import { useRef } from 'react'

const ITEMS = [
  { text: '120+ Countries',              accent: 'blue'   },
  { text: 'Global Icon of the Year',     accent: 'orange' },
  { text: '5,000+ Icons Recognised',     accent: 'blue'   },
  { text: 'Excellence in Innovation',    accent: 'orange' },
  { text: '18 Years of Excellence',      accent: 'blue'   },
  { text: 'Peace & Diplomacy Award',     accent: 'orange' },
  { text: '200+ Partner Organisations',  accent: 'blue'   },
  { text: 'Humanitarian Leadership',     accent: 'orange' },
  { text: 'United Nations Foundation',   accent: 'blue'   },
  { text: 'Cultural Excellence Award',   accent: 'orange' },
  { text: 'Business Icon of the Decade', accent: 'blue'   },
  { text: 'Global Peace Institute',      accent: 'orange' },
]

const DOUBLED = [...ITEMS, ...ITEMS]

const DOT = ({ accent }) => (
  <span aria-hidden="true" style={{
    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
    background: accent === 'blue' ? '#0f7ea3' : '#e05a24',
    margin: '0 1.6rem', verticalAlign: 'middle', flexShrink: 0,
  }} />
)

export default function MarqueeTicker({ direction = 'left' }) {
  const trackRef = useRef()
  const duration = `${DOUBLED.length * 4.2}s`

  return (
    <div
      aria-label="Global achievements ticker"
      style={{
        overflow: 'hidden', width: '100%',
        borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.15)',
        padding: '0.85rem 0', background: 'var(--color-bg-deep)', userSelect: 'none',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
          animation: `marquee-${direction} ${duration} linear infinite`,
          willChange: 'transform',
        }}
      >
        {DOUBLED.map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: item.accent === 'blue' ? '#0f7ea3' : '#e05a24',
            flexShrink: 0,
          }}>
            {item.text}
            <DOT accent={item.accent} />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
      `}</style>
    </div>
  )
}
