import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- Utility: lat/lon to 3D cartesian ---
function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}

// --- Globe wireframe mesh ---
function GlobeWireframe({ radius = 2.4 }) {
  const meshRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.09
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 36, 36]} />
      <meshBasicMaterial
        color="#0f7ea3"
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  )
}

// --- Solid inner sphere with subtle gradient feel ---
function GlobeSolid({ radius = 2.35 }) {
  const meshRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.09
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhongMaterial
        color="#e8f5fa"
        emissive="#c5e8f5"
        emissiveIntensity={0.2}
        transparent
        opacity={0.45}
        shininess={20}
      />
    </mesh>
  )
}

// --- Glowing orange particle dots on globe surface ---
function GlobeParticles({ radius = 2.45, count = 80 }) {
  const ref = useRef()
  const timeRef = useRef(0)

  const { positions, phases } = useMemo(() => {
    const positions = []
    const phases = []
    // Spread points roughly across globe surface using Fibonacci sphere
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r
      positions.push(x * radius, y * radius, z * radius)
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions: new Float32Array(positions), phases }
  }, [count, radius])

  useFrame((state) => {
    if (!ref.current) return
    timeRef.current = state.clock.elapsedTime
    ref.current.rotation.y += 0.0005
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
        color="#e05a24"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

// --- Connecting arc lines between random node pairs ---
function GlobeArcs({ radius = 2.48, count = 18 }) {
  const groupRef = useRef()

  const lines = useMemo(() => {
    const result = []
    const nodes = []
    // Create random lat/lon nodes
    for (let i = 0; i < 30; i++) {
      nodes.push({
        lat: (Math.random() - 0.5) * 160,
        lon: (Math.random() - 0.5) * 360,
      })
    }
    // Connect random pairs with arcs
    for (let i = 0; i < count; i++) {
      const a = nodes[Math.floor(Math.random() * nodes.length)]
      const b = nodes[Math.floor(Math.random() * nodes.length)]
      if (a === b) continue

      const va = latLonToVec3(a.lat, a.lon, radius)
      const vb = latLonToVec3(b.lat, b.lon, radius)

      // Arc via midpoint lifted off sphere
      const mid = va.clone().add(vb).multiplyScalar(0.5)
      const lift = radius * 0.22
      mid.normalize().multiplyScalar(radius + lift)

      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb)
      const pts = curve.getPoints(40)
      result.push(pts)
    }
    return result
  }, [radius, count])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.09
  })

  return (
    <group ref={groupRef}>
      {lines.map((pts, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial
              color={i % 3 === 0 ? '#e05a24' : '#0f7ea3'}
              transparent
              opacity={0.25}
            />
          </line>
        )
      })}
    </group>
  )
}

// --- Soft ground shadow disc ---
function ShadowDisc() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
      <circleGeometry args={[2.2, 64]} />
      <meshBasicMaterial color="#0f7ea3" transparent opacity={0.07} />
    </mesh>
  )
}

// --- Parallax mouse handler ---
function ParallaxRig({ children }) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame(() => {
    current.current.x += (target.current.x - current.current.x) * 0.05
    current.current.y += (target.current.y - current.current.y) * 0.05
    camera.position.x = current.current.x
    camera.position.y = current.current.y
    camera.lookAt(0, 0, 0)
  })

  return <>{children}</>
}

// --- Main exported scene ---
export default function GlobeScene() {
  return (
    <ParallaxRig>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-4, 3, -4]} intensity={0.4} color="#0f7ea3" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#e05a24" />

      <GlobeSolid />
      <GlobeWireframe />
      <GlobeParticles />
      <GlobeArcs />
      <ShadowDisc />
    </ParallaxRig>
  )
}
