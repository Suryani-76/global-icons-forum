import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Crown shape (extruded) ---
function Crown({ position = [0, 0.55, 0] }) {
  const ref = useRef()
  const shape = new THREE.Shape()

  // Crown base
  shape.moveTo(-0.55, 0)
  shape.lineTo(-0.55, 0.22)
  // Left peak
  shape.lineTo(-0.38, 0.55)
  shape.lineTo(-0.22, 0.22)
  // Center peak (tallest)
  shape.lineTo(0, 0.68)
  shape.lineTo(0.22, 0.22)
  // Right peak
  shape.lineTo(0.38, 0.55)
  shape.lineTo(0.55, 0.22)
  shape.lineTo(0.55, 0)
  shape.closePath()

  const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 }

  return (
    <mesh ref={ref} position={position}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#e05a24"
        metalness={0.55}
        roughness={0.28}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

// --- Shield body (extruded) ---
function ShieldBody() {
  const shape = new THREE.Shape()
  // Classic shield silhouette
  shape.moveTo(0, -1.45)
  shape.bezierCurveTo(0.55, -1.1, 1.0, -0.5, 1.0, 0.2)
  shape.lineTo(1.0, 0.9)
  shape.lineTo(0, 1.1)
  shape.lineTo(-1.0, 0.9)
  shape.lineTo(-1.0, 0.2)
  shape.bezierCurveTo(-1.0, -0.5, -0.55, -1.1, 0, -1.45)

  // Inner cutout for layered look
  const hole = new THREE.Path()
  hole.moveTo(0, -1.1)
  hole.bezierCurveTo(0.38, -0.82, 0.72, -0.35, 0.72, 0.18)
  hole.lineTo(0.72, 0.72)
  hole.lineTo(0, 0.88)
  hole.lineTo(-0.72, 0.72)
  hole.lineTo(-0.72, 0.18)
  hole.bezierCurveTo(-0.72, -0.35, -0.38, -0.82, 0, -1.1)
  shape.holes.push(hole)

  const extrudeSettings = { depth: 0.18, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 4 }

  return (
    <mesh castShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#0f7ea3"
        metalness={0.6}
        roughness={0.22}
        envMapIntensity={1.0}
      />
    </mesh>
  )
}

// --- Shield inner fill ---
function ShieldInner() {
  const shape = new THREE.Shape()
  shape.moveTo(0, -1.1)
  shape.bezierCurveTo(0.38, -0.82, 0.72, -0.35, 0.72, 0.18)
  shape.lineTo(0.72, 0.72)
  shape.lineTo(0, 0.88)
  shape.lineTo(-0.72, 0.72)
  shape.lineTo(-0.72, 0.18)
  shape.bezierCurveTo(-0.72, -0.35, -0.38, -0.82, 0, -1.1)

  const extrudeSettings = { depth: 0.06, bevelEnabled: false }

  return (
    <mesh position={[0, 0, 0.06]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#0a5f7a" metalness={0.4} roughness={0.3} />
    </mesh>
  )
}

// --- Globe icon on shield ---
function GlobeIcon({ position = [0, -0.12, 0.32] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="#e05a24" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Latitude lines */}
      {[-0.1, 0, 0.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[Math.sqrt(0.28 * 0.28 - y * y), 0.008, 8, 32]} />
          <meshStandardMaterial color="#fff" opacity={0.6} transparent />
        </mesh>
      ))}
      {/* Longitude lines */}
      {[0, Math.PI / 3, Math.PI * 2 / 3].map((angle, i) => (
        <mesh key={i} rotation={[0, angle, 0]}>
          <torusGeometry args={[0.28, 0.008, 8, 32]} />
          <meshStandardMaterial color="#fff" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  )
}

// --- Laurel leaves (simplified arc of small spheres/capsules) ---
function LaurelLeaves() {
  const leftLeaves = []
  const rightLeaves = []
  const count = 7

  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) - 0.5
    const angle = t * 1.1
    const r = 1.32
    const x = Math.sin(angle) * r - r * 0.52
    const y = Math.cos(angle) * r - r + 0.25

    leftLeaves.push(
      <mesh key={i} position={[-x, y, 0.05]} rotation={[0, 0, -angle + Math.PI * 0.05]}>
        <capsuleGeometry args={[0.058, 0.18, 4, 8]} />
        <meshStandardMaterial color="#0f7ea3" metalness={0.3} roughness={0.5} />
      </mesh>
    )
    rightLeaves.push(
      <mesh key={i} position={[x, y, 0.05]} rotation={[0, 0, angle - Math.PI * 0.05]}>
        <capsuleGeometry args={[0.058, 0.18, 4, 8]} />
        <meshStandardMaterial color="#0f7ea3" metalness={0.3} roughness={0.5} />
      </mesh>
    )
  }

  return (
    <group position={[0, -0.6, 0.1]}>
      {leftLeaves}
      {rightLeaves}
    </group>
  )
}

// --- Soft glow plane beneath ---
function GlowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.65, 0]}>
      <circleGeometry args={[1.4, 48]} />
      <meshBasicMaterial color="#e05a24" transparent opacity={0.09} />
    </mesh>
  )
}

// --- Main ShieldLogoScene ---
export default function ShieldLogoScene({ isHovered }) {
  const groupRef = useRef()
  const targetRotY = useRef(0)
  const targetRotX = useRef(0)
  const bobRef = useRef(0)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Gentle bob
    bobRef.current = Math.sin(t * 0.9) * 0.08
    groupRef.current.position.y = bobRef.current

    // Idle slow rotation
    targetRotY.current = isHovered ? Math.sin(t * 1.2) * 0.4 : Math.sin(t * 0.3) * 0.12
    targetRotX.current = isHovered ? Math.sin(t * 0.9) * 0.15 : Math.sin(t * 0.2) * 0.05

    groupRef.current.rotation.y += (targetRotY.current - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (targetRotX.current - groupRef.current.rotation.x) * 0.05
  })

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} color="#ffffff" castShadow />
      <pointLight position={[-3, 3, 3]} intensity={0.5} color="#0f7ea3" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#e05a24" />
      <spotLight position={[0, 8, 2]} intensity={0.6} penumbra={0.8} color="#ffffff" />

      <group ref={groupRef} position={[0, 0, 0]}>
        <ShieldBody />
        <ShieldInner />
        <Crown />
        <GlobeIcon />
        <LaurelLeaves />
      </group>

      <GlowPlane />
    </>
  )
}
