import { Html, useProgress } from '@react-three/drei'

/**
 * Loading fallback for Suspense in R3F canvases.
 * Styled to match white/blue/orange theme.
 */
export function CanvasLoader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        userSelect: 'none',
      }}>
        <div className="loader-ring" />
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: '#0f7ea3',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
        }}>
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  )
}

/**
 * Non-Three.js full-panel loader for section containers.
 */
export function SectionLoader() {
  return (
    <div className="canvas-loader" aria-label="Loading 3D content" role="status">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div className="loader-ring" />
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', color: '#0f7ea3', textTransform: 'uppercase' }}>
          Loading
        </span>
      </div>
    </div>
  )
}
