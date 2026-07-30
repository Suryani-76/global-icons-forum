import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Pulsing ring group ---
function PulseRing({ delay = 0, radius = 1.2, color = '#e05a24' }) {
  const ref = useRef()
  const startTime = useRef(delay)

  useFrame((state) => {
    if (!ref.current) return
    const t = ((state.clock.elapsedTime + startTime.current) % 3.2) / 3.2
    const scale = 1 + t * 1.8
    ref.current.scale.set(scale, scale, scale)
    ref.current.material.opacity = (1 - t) * 0.28
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.08, radius, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
    </mesh>
  )
}

// --- Central glowing sphere ---
function CoreSphere() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial
        color="#e05a24"
        emissive="#e05a24"
        emissiveIntensity={0.45}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

// --- Orbiting small sphere ---
function OrbitDot({ radius = 1.5, speed = 0.5, yOffset = 0.15, color = '#0f7ea3', phase = 0 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phase
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = yOffset + Math.sin(t * 2) * 0.06
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

export default function CtaScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 3, 0]} intensity={1.2} color="#e05a24" />
      <pointLight position={[3, 0, 3]} intensity={0.5} color="#0f7ea3" />

      <CoreSphere />

      <PulseRing delay={0} radius={1.0} color="#e05a24" />
      <PulseRing delay={1.1} radius={1.0} color="#e05a24" />
      <PulseRing delay={2.2} radius={1.0} color="#e05a24" />

      <PulseRing delay={0.6} radius={1.8} color="#0f7ea3" />
      <PulseRing delay={1.8} radius={1.8} color="#0f7ea3" />

      <OrbitDot radius={1.6} speed={0.45} yOffset={0.1} color="#0f7ea3" phase={0} />
      <OrbitDot radius={1.6} speed={0.45} yOffset={-0.1} color="#0f7ea3" phase={Math.PI} />
      <OrbitDot radius={1.0} speed={0.9} yOffset={0.25} color="#e05a24" phase={1.2} />
    </>
  )
}
