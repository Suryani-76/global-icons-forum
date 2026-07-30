import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Pin body ---
function PinBody() {
  // Tear-drop / map-pin shape via lathe
  const profilePoints = []
  for (let i = 0; i <= 24; i++) {
    const t = i / 24
    const angle = t * Math.PI
    // Upper circular part
    const r = Math.sin(angle) * 0.46
    const y = Math.cos(angle) * 0.46 + 0.46
    profilePoints.push(new THREE.Vector2(r, y))
  }
  // Taper to point at bottom
  profilePoints.push(new THREE.Vector2(0.04, -0.42))
  profilePoints.push(new THREE.Vector2(0, -0.55))

  return (
    <mesh castShadow>
      <latheGeometry args={[profilePoints, 32]} />
      <meshStandardMaterial
        color="#e05a24"
        metalness={0.35}
        roughness={0.32}
        emissive="#e05a24"
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

// --- White circle hole in pin ---
function PinHole() {
  return (
    <mesh position={[0, 0.44, 0.44]}>
      <circleGeometry args={[0.18, 32]} />
      <meshBasicMaterial color="#fff" />
    </mesh>
  )
}

// --- Glowing drop ring on ground ---
function DropRing() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 2.0) * 0.15
    ref.current.scale.set(pulse, pulse, pulse)
    ref.current.material.opacity = 0.18 + Math.sin(t * 2.0) * 0.07
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
      <ringGeometry args={[0.28, 0.52, 48]} />
      <meshBasicMaterial color="#e05a24" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  )
}

// --- Small floating globe ---
function MiniGlobe() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.008
  })

  return (
    <group position={[1.4, 0.3, 0]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#0f7ea3" wireframe opacity={0.5} transparent />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#d6eef5" opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

// --- Main scene ---
export default function LocationPinScene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.08
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15
  })

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[4, 6, 3]} intensity={0.8} color="#fff" />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#0f7ea3" />
      <pointLight position={[2, -1, 2]} intensity={0.35} color="#e05a24" />

      <group ref={groupRef} position={[0, 0.3, 0]}>
        <PinBody />
        <PinHole />
      </group>

      <DropRing />
      <MiniGlobe />
    </>
  )
}
