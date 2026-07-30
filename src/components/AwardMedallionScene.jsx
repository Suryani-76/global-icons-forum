import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   6 glowing award medallions — one per award category
   Arranged in a 3×2 floating grid, each with unique color
   and symbol geometry, all gently bobbing + rotating
   ============================================================ */

const MEDALS = [
  { label: 'Global Icon',    color: '#f7c430', emissive: '#f7c430', x: -1.5, y:  0.85, symbol: 'star'     },
  { label: 'Innovation',     color: '#4dc8f0', emissive: '#4dc8f0', x:  0.0, y:  0.85, symbol: 'lightning'},
  { label: 'Peace',          color: '#a8e6cf', emissive: '#a8e6cf', x:  1.5, y:  0.85, symbol: 'ring'     },
  { label: 'Humanitarian',   color: '#ff7a3d', emissive: '#ff7a3d', x: -1.5, y: -0.85, symbol: 'heart'    },
  { label: 'Business',       color: '#c084fc', emissive: '#c084fc', x:  0.0, y: -0.85, symbol: 'diamond'  },
  { label: 'Culture',        color: '#fbbf24', emissive: '#fbbf24', x:  1.5, y: -0.85, symbol: 'laurel'   },
]

// --- Star symbol ---
function StarSymbol({ color }) {
  const shape = new THREE.Shape()
  const o = 0.28, inn = 0.13, pts = 5
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2
    const r = i % 2 === 0 ? o : inn
    if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  shape.closePath()
  return (
    <mesh position={[0, 0, 0.12]}>
      <extrudeGeometry args={[shape, { depth: 0.08, bevelEnabled: false }]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.6} roughness={0.1} />
    </mesh>
  )
}

// --- Lightning bolt ---
function LightningSymbol({ color }) {
  const shape = new THREE.Shape()
  shape.moveTo(0.08, 0.32)
  shape.lineTo(-0.12, 0.04)
  shape.lineTo(0.04, 0.04)
  shape.lineTo(-0.08, -0.32)
  shape.lineTo(0.14, -0.04)
  shape.lineTo(-0.02, -0.04)
  shape.closePath()
  return (
    <mesh position={[0, 0, 0.12]}>
      <extrudeGeometry args={[shape, { depth: 0.08, bevelEnabled: false }]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.5} roughness={0.1} />
    </mesh>
  )
}

// --- Peace ring ---
function RingSymbol({ color }) {
  return (
    <group position={[0, 0, 0.12]}>
      <mesh>
        <torusGeometry args={[0.22, 0.06, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} metalness={0.5} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[-0.12, -0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0.12, -0.06, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
    </group>
  )
}

// --- Heart ---
function HeartSymbol({ color }) {
  const shape = new THREE.Shape()
  shape.moveTo(0, -0.28)
  shape.bezierCurveTo(-0.28, -0.28, -0.32, 0.08, -0.32, 0.08)
  shape.bezierCurveTo(-0.32, 0.24, -0.16, 0.34, 0, 0.18)
  shape.bezierCurveTo(0.16, 0.34, 0.32, 0.24, 0.32, 0.08)
  shape.bezierCurveTo(0.32, 0.08, 0.28, -0.28, 0, -0.28)
  return (
    <mesh position={[0, 0, 0.12]}>
      <extrudeGeometry args={[shape, { depth: 0.08, bevelEnabled: false }]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.4} roughness={0.15} />
    </mesh>
  )
}

// --- Diamond ---
function DiamondSymbol({ color }) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.32)
  shape.lineTo(0.22, 0.08)
  shape.lineTo(0.22, -0.04)
  shape.lineTo(0, -0.32)
  shape.lineTo(-0.22, -0.04)
  shape.lineTo(-0.22, 0.08)
  shape.closePath()
  return (
    <mesh position={[0, 0, 0.12]}>
      <extrudeGeometry args={[shape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} metalness={0.9} roughness={0.05} />
    </mesh>
  )
}

// --- Laurel leaves (simple arc) ---
function LaurelSymbol({ color }) {
  return (
    <group position={[0, 0, 0.1]}>
      {[-1, 1].map((side, si) => (
        Array.from({ length: 5 }).map((_, i) => {
          const t = (i / 4) - 0.5
          const angle = t * 1.1 * side
          const r = 0.28
          return (
            <mesh key={`${si}-${i}`}
              position={[Math.sin(angle) * r * side, Math.cos(angle) * r - 0.05, 0]}
              rotation={[0, 0, angle * side * 0.8]}
            >
              <capsuleGeometry args={[0.04, 0.14, 3, 6]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
            </mesh>
          )
        })
      ))}
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#f7c430" emissive="#f7c430" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

const SYMBOL_MAP = {
  star:      StarSymbol,
  lightning: LightningSymbol,
  ring:      RingSymbol,
  heart:     HeartSymbol,
  diamond:   DiamondSymbol,
  laurel:    LaurelSymbol,
}

// --- Individual medal disc ---
function Medal({ medal, index }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime + index * 0.7
    groupRef.current.position.y = medal.y + Math.sin(t * 0.8) * 0.08
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.3
  })

  const Symbol = SYMBOL_MAP[medal.symbol]

  return (
    <group ref={groupRef} position={[medal.x, medal.y, 0]}>
      {/* Glow halo behind disc */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[0.52, 32]} />
        <meshBasicMaterial color={medal.color} transparent opacity={0.18} />
      </mesh>

      {/* Disc body */}
      <mesh>
        <cylinderGeometry args={[0.44, 0.44, 0.1, 36]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color={medal.color}
          metalness={0.85}
          roughness={0.12}
          emissive={medal.emissive}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Inner relief ring */}
      <mesh position={[0, 0, 0.06]}>
        <ringGeometry args={[0.3, 0.42, 36]} />
        <meshStandardMaterial color={medal.color} metalness={0.9} roughness={0.08} emissive={medal.emissive} emissiveIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Symbol */}
      <Symbol color={medal.color} />
    </group>
  )
}

// --- Connecting lines between medals ---
function ConnectionLines() {
  const geo = useMemo(() => {
    const verts = []
    const pairs = [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5]]
    pairs.forEach(([a, b]) => {
      verts.push(MEDALS[a].x, MEDALS[a].y, 0)
      verts.push(MEDALS[b].x, MEDALS[b].y, 0)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
    return g
  }, [])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </lineSegments>
  )
}

export default function AwardMedallionScene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[0, 4, 4]}   intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, 2, 2]}  intensity={1.5} color="#f7c430" />
      <pointLight position={[4, -2, 2]}  intensity={1.2} color="#4dc8f0" />
      <spotLight   position={[0, 6, 3]}  intensity={2.0} penumbra={0.7} color="#fff8f0" />

      <ConnectionLines />
      {MEDALS.map((m, i) => (
        <Medal key={i} medal={m} index={i} />
      ))}
    </>
  )
}
