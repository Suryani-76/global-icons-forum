import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   Golden particle rain + floating award badges
   Used in the "Hall of Fame" cinematic dark section
   ============================================================ */

// --- Falling gold particles ---
function GoldParticles({ count = 120 }) {
  const ref = useRef()

  const { positions, velocities, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = []
    const ph  = []
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      vel.push(-(Math.random() * 0.015 + 0.006))
      ph.push(Math.random() * Math.PI * 2)
    }
    return { positions: pos, velocities: vel, phases: ph }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += velocities[i]
      // Slight horizontal drift
      pos.array[i * 3 + 0] += Math.sin(t * 0.3 + phases[i]) * 0.003
      // Wrap when fallen off bottom
      if (pos.array[i * 3 + 1] < -7) {
        pos.array[i * 3 + 1] = 7
        pos.array[i * 3 + 0] = (Math.random() - 0.5) * 22
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f7c430"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  )
}

// --- Spinning award medal ---
function AwardMedal({ position = [0, 0, 0], delay = 0 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + delay
    ref.current.rotation.y = t * 0.55
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15
  })

  return (
    <group ref={ref} position={position}>
      {/* Medal disc */}
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 32]} />
        <meshStandardMaterial color="#f7c430" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Inner relief circle */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 32]} />
        <meshStandardMaterial color="#e5a800" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Star on medal */}
      {[0,1,2,3,4].map((j) => {
        const angle = (j / 5) * Math.PI * 2 - Math.PI / 2
        return (
          <mesh key={j} position={[Math.cos(angle) * 0.18, 0.08, Math.sin(angle) * 0.18]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#fff8dc" metalness={0.7} roughness={0.2} />
          </mesh>
        )
      })}
      {/* Ribbon */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.12, 0.62, 0.04]} />
        <meshStandardMaterial color="#0f7ea3" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

// --- Background floating rings ---
function FloatingRing({ position, radius, color, speed, phase }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * speed + phase
    ref.current.rotation.z = t * speed * 0.6 + phase
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.4
  })
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.03, 8, 48]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} transparent opacity={0.35} />
    </mesh>
  )
}

export default function HallOfFameScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 3]}   intensity={1.8} color="#f7c430" />
      <pointLight position={[-5, 0, 2]}  intensity={0.8} color="#0f7ea3" />
      <pointLight position={[5, -2, 2]}  intensity={0.6} color="#e05a24" />
      <spotLight  position={[0, 8, 0]}   intensity={1.2} penumbra={0.8} color="#fff8dc" />

      <GoldParticles count={140} />

      <AwardMedal position={[-3.5, 0, 0]} delay={0}   />
      <AwardMedal position={[ 0,   0, 0]} delay={1.4} />
      <AwardMedal position={[ 3.5, 0, 0]} delay={2.8} />

      <FloatingRing position={[-6, 1, -2]}  radius={1.2} color="#f7c430" speed={0.18} phase={0}   />
      <FloatingRing position={[6, -1, -2]}  radius={1.0} color="#0f7ea3" speed={0.22} phase={2.1} />
      <FloatingRing position={[0, -2.5, -3]} radius={1.5} color="#e05a24" speed={0.14} phase={1.0} />
    </>
  )
}
