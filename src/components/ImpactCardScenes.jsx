import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   Impact card 3D mini-scenes — dark background, high contrast,
   large bright geometries for clear visibility at 90×90px
   ============================================================ */

// 1. Global Recognition — bright wireframe globe + orange dots
export function GlobalRecognitionScene() {
  const meshRef = useRef()
  const dotsRef = useRef()

  const dotPositions = new Float32Array(
    Array.from({ length: 32 }, () => {
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = 1.05
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ]
    }).flat()
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y = t * 0.6
    if (dotsRef.current) dotsRef.current.rotation.y = t * 0.6
  })

  return (
    <>
      <ambientLight intensity={2.0} />
      <pointLight position={[2, 2, 3]} intensity={2.0} color="#4dc8f0" />
      <pointLight position={[-2, -2, 2]} intensity={1.2} color="#e05a24" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.0, 20, 20]} />
        <meshBasicMaterial color="#4dc8f0" wireframe />
      </mesh>
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={dotPositions}
            count={dotPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#ff7a3d" size={0.16} sizeAttenuation />
      </points>
    </>
  )
}

// 2. Awards & Honours — bright gold spinning star
export function AwardsScene() {
  const groupRef = useRef()

  const starShape = new THREE.Shape()
  const outerR = 0.88, innerR = 0.40, pts = 5
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    if (i === 0) starShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    else starShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  starShape.closePath()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.2
    groupRef.current.rotation.y = t * 0.7
    groupRef.current.position.y = Math.sin(t * 1.1) * 0.1
  })

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 3, 3]} intensity={3.0} color="#f7c430" />
      <pointLight position={[-2, -2, 2]} intensity={1.2} color="#ff6a00" />
      <group ref={groupRef}>
        <mesh>
          <extrudeGeometry args={[starShape, { depth: 0.38, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06 }]} />
          <meshStandardMaterial
            color="#f7c430"
            metalness={0.8}
            roughness={0.12}
            emissive="#f7c430"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </>
  )
}

// 3. Community Building — bright glowing node network
export function CommunityScene() {
  const groupRef = useRef()

  const nodes = [
    [0, 0, 0],
    [0.85, 0.4, 0.2],
    [-0.85, 0.4, -0.1],
    [0, -0.95, 0.3],
    [0.6, -0.5, -0.4],
    [-0.6, -0.4, 0.4],
  ]

  const lineGeo = new THREE.BufferGeometry()
  const lineVerts = []
  for (let i = 1; i < nodes.length; i++) {
    lineVerts.push(...nodes[0], ...nodes[i])
    if (i < nodes.length - 1) lineVerts.push(...nodes[i], ...nodes[i + 1])
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3))

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.22
    }
  })

  return (
    <>
      <ambientLight intensity={1.8} />
      <pointLight position={[2, 2, 3]} intensity={2.5} color="#4dc8f0" />
      <pointLight position={[-1, -1, 2]} intensity={1.5} color="#ff7a3d" />
      <group ref={groupRef}>
        {nodes.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[i === 0 ? 0.24 : 0.15, 14, 14]} />
            <meshStandardMaterial
              color={i === 0 ? '#ff7a3d' : '#4dc8f0'}
              emissive={i === 0 ? '#ff7a3d' : '#4dc8f0'}
              emissiveIntensity={0.9}
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>
        ))}
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color="#4dc8f0" transparent opacity={0.7} />
        </lineSegments>
      </group>
    </>
  )
}

// 4. Summit & Forums — glowing coloured pillars
export function SummitScene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.45
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
    }
  })

  const pillars = [
    { x: -0.62, h: 1.2, color: '#4dc8f0', emissive: '#4dc8f0' },
    { x:  0.0,  h: 1.75, color: '#ff7a3d', emissive: '#ff7a3d' },
    { x:  0.62, h: 1.0,  color: '#4dc8f0', emissive: '#4dc8f0' },
  ]

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 3]} intensity={1.5} color="#fff" />
      <pointLight position={[0, 3, 3]} intensity={2.0} color="#ff7a3d" />
      <group ref={groupRef}>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[2.0, 0.18, 0.55]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
        {pillars.map((p, i) => (
          <mesh key={i} position={[p.x, p.h / 2 - 0.76, 0]}>
            <boxGeometry args={[0.3, p.h, 0.3]} />
            <meshStandardMaterial color={p.color} metalness={0.5} roughness={0.2} emissive={p.emissive} emissiveIntensity={0.5} />
          </mesh>
        ))}
        {pillars.map((p, i) => (
          <mesh key={i} position={[p.x, p.h - 0.76, 0]}>
            <boxGeometry args={[0.38, 0.12, 0.38]} />
            <meshStandardMaterial color="#f7c430" metalness={0.8} roughness={0.15} emissive="#f7c430" emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
    </>
  )
}

// 5. Media & Spotlight — bright spinning rings + glowing lens
export function MediaScene() {
  const outerRef = useRef()
  const innerRef = useRef()
  const beamRef  = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) outerRef.current.rotation.z = t * 0.55
    if (innerRef.current) innerRef.current.rotation.z = -t * 0.85
    if (beamRef.current) {
      beamRef.current.rotation.z = Math.sin(t * 1.2) * 0.5
      beamRef.current.material.opacity = 0.35 + Math.sin(t * 2) * 0.15
    }
  })

  const beamShape = new THREE.Shape()
  beamShape.moveTo(0, 0)
  beamShape.lineTo(-0.3, 1.4)
  beamShape.lineTo(0.3, 1.4)
  beamShape.closePath()

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 2, 3]} intensity={2.5} color="#ff7a3d" />
      <pointLight position={[-2, -1, 2]} intensity={1.5} color="#4dc8f0" />

      <mesh ref={outerRef}>
        <torusGeometry args={[0.9, 0.1, 10, 36]} />
        <meshStandardMaterial color="#4dc8f0" metalness={0.7} roughness={0.15} emissive="#4dc8f0" emissiveIntensity={0.55} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[0.56, 0.08, 10, 28]} />
        <meshStandardMaterial color="#ff7a3d" metalness={0.7} roughness={0.15} emissive="#ff7a3d" emissiveIntensity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffde0" emissiveIntensity={1.2} metalness={0.1} roughness={0.05} />
      </mesh>
      <mesh ref={beamRef} position={[0, 0.28, 0]}>
        <shapeGeometry args={[beamShape]} />
        <meshBasicMaterial color="#f7c430" transparent opacity={0.38} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// 6. Diplomacy & Peace — bright glowing orbiting rings
export function DiplomacyScene() {
  const ring1   = useRef()
  const ring2   = useRef()
  const ring3   = useRef()
  const coreRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) ring1.current.rotation.y = t * 0.55
    if (ring2.current) { ring2.current.rotation.x = t * 0.45; ring2.current.rotation.z = t * 0.22 }
    if (ring3.current) ring3.current.rotation.z = -t * 0.38
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.07)
  })

  return (
    <>
      <ambientLight intensity={1.8} />
      <pointLight position={[3, 2, 3]} intensity={2.5} color="#4dc8f0" />
      <pointLight position={[-2, -2, 2]} intensity={1.5} color="#ff7a3d" />

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 22, 22]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} metalness={0.1} roughness={0.2} />
      </mesh>
      <mesh ref={ring1}>
        <torusGeometry args={[0.82, 0.07, 10, 52]} />
        <meshStandardMaterial color="#4dc8f0" metalness={0.6} roughness={0.2} emissive="#4dc8f0" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.82, 0.06, 10, 52]} />
        <meshStandardMaterial color="#ff7a3d" metalness={0.6} roughness={0.2} emissive="#ff7a3d" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ring3} rotation={[-Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[0.82, 0.05, 10, 52]} />
        <meshStandardMaterial color="#f7c430" metalness={0.6} roughness={0.2} emissive="#f7c430" emissiveIntensity={0.5} />
      </mesh>

      {[0, 1].map((i) => (
        <OrbitingDot key={i} radius={0.82} speed={0.9 + i * 0.35} phase={i * Math.PI} color={i === 0 ? '#ff7a3d' : '#4dc8f0'} />
      ))}
    </>
  )
}

function OrbitingDot({ radius, speed, phase, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phase
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
    </mesh>
  )
}
