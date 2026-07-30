import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   Gold trophy — high contrast, clearly visible on white bg
   Gold cup + dark marble base + bright star + orange handles
   ============================================================ */

// --- Gold cup body (lathe) ---
function TrophyCup() {
  const points = []
  for (let i = 0; i <= 32; i++) {
    const t = i / 32
    const y = t * 1.8
    let x
    if (t < 0.08) {
      x = 0.16 + t * 2.0       // flare from stem
    } else if (t < 0.5) {
      const u = (t - 0.08) / 0.42
      x = 0.32 + Math.sin(u * Math.PI) * 0.68  // wide belly
    } else if (t < 0.82) {
      const u = (t - 0.5) / 0.32
      x = 1.0 - u * 0.18       // taper to rim
    } else {
      x = 0.82 + (t - 0.82) * 0.3  // slight rim flare
    }
    points.push(new THREE.Vector2(x, y))
  }

  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[points, 64]} />
      <meshStandardMaterial
        color="#d4a017"
        metalness={0.92}
        roughness={0.08}
        emissive="#8b6500"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

// --- Inner dark bowl (cup opening) ---
function CupBowlInner() {
  const points = []
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    const y = 1.8 + t * 0.18
    const x = 0.88 - t * 0.55
    points.push(new THREE.Vector2(x, y))
  }
  return (
    <mesh>
      <latheGeometry args={[points, 48]} />
      <meshStandardMaterial color="#1a0e00" roughness={0.8} metalness={0.1} side={THREE.BackSide} />
    </mesh>
  )
}

// --- Stem connecting cup to base ---
function Stem() {
  return (
    <group position={[0, -0.22, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.22, 0.55, 28]} />
        <meshStandardMaterial color="#c8963a" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Knob in middle of stem */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#f7c430" metalness={0.9} roughness={0.1} emissive="#c8963a" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// --- Tiered base ---
function TrophyBase() {
  return (
    <group position={[0, -1.55, 0]}>
      {/* Top tier */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.18, 32]} />
        <meshStandardMaterial color="#c8963a" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Middle tier */}
      <mesh castShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.72, 0.82, 0.2, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Bottom plinth */}
      <mesh castShadow>
        <boxGeometry args={[1.9, 0.22, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* Gold trim on bottom plinth */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.92, 0.04, 0.92]} />
        <meshStandardMaterial color="#d4a017" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[1.92, 0.04, 0.92]} />
        <meshStandardMaterial color="#d4a017" metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  )
}

// --- Elegant curved handles ---
function Handle({ side = 1 }) {
  const pts = [
    new THREE.Vector3(side * 0.82, 0.5,  0),
    new THREE.Vector3(side * 1.35, 0.75, 0.05),
    new THREE.Vector3(side * 1.45, 1.1,  0),
    new THREE.Vector3(side * 1.35, 1.45, -0.05),
    new THREE.Vector3(side * 0.82, 1.65, 0),
  ]
  const geo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts), 28, 0.065, 12, false
  )
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color="#e05a24" metalness={0.82} roughness={0.14} emissive="#e05a24" emissiveIntensity={0.12} />
    </mesh>
  )
}

// --- Bright gold star on top ---
function TopStar() {
  const starShape = new THREE.Shape()
  const outerR = 0.3, innerR = 0.13, pts = 5
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    if (i === 0) starShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    else starShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  starShape.closePath()
  return (
    <mesh position={[0, 2.06, 0.05]} castShadow>
      <extrudeGeometry args={[starShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 4 }]} />
      <meshStandardMaterial color="#ffe066" metalness={0.85} roughness={0.1} emissive="#f7c430" emissiveIntensity={0.45} />
    </mesh>
  )
}

// --- Pulsing glow disc on ground ---
function GlowDisc() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.scale.x = 1 + Math.sin(t * 1.4) * 0.1
    ref.current.scale.z = 1 + Math.sin(t * 1.4) * 0.1
    ref.current.material.opacity = 0.18 + Math.sin(t * 1.4) * 0.07
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
      <ringGeometry args={[0.5, 1.8, 64]} />
      <meshBasicMaterial color="#d4a017" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  )
}

// --- Shadow disc ---
function ShadowDisc() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.06, 0]}>
      <circleGeometry args={[1.4, 48]} />
      <meshBasicMaterial color="#000" transparent opacity={0.08} />
    </mesh>
  )
}

export default function TrophyScene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.3
    groupRef.current.position.y = Math.sin(t * 0.75) * 0.07
  })

  return (
    <>
      {/* Strong bright lighting for clear visibility */}
      <ambientLight intensity={1.6} color="#fff8f0" />
      <directionalLight position={[4, 8, 5]}  intensity={2.2} color="#ffffff" castShadow />
      <directionalLight position={[-4, 6, -3]} intensity={1.2} color="#fff4e0" />
      <pointLight position={[0, 5, 4]}   intensity={2.0} color="#f7c430" />
      <pointLight position={[-3, 2, 3]}  intensity={1.0} color="#ffffff" />
      <pointLight position={[3, 0, -2]}  intensity={0.8} color="#e05a24" />
      <spotLight  position={[0, 8, 2]}   intensity={1.5} penumbra={0.6} color="#fffde0" angle={0.5} />

      <group ref={groupRef}>
        <TrophyBase />
        <Stem />
        <TrophyCup />
        <CupBowlInner />
        <Handle side={1} />
        <Handle side={-1} />
        <TopStar />
      </group>

      <GlowDisc />
      <ShadowDisc />
    </>
  )
}
