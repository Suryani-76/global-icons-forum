import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

/* ============================================================
   Unique 3D scene per social platform.
   Each has its own geometry + animation personality.
   ============================================================ */

// ---- Shared: rounded-rect extruded badge (base for all) ----
function Badge({ color, emissiveIntensity = 0, children }) {
  const shape = new THREE.Shape()
  const r = 0.22, w = 0.72, h = 0.72
  shape.moveTo(-w + r, -h)
  shape.lineTo( w - r, -h)
  shape.quadraticCurveTo( w, -h,  w, -h + r)
  shape.lineTo( w,  h - r)
  shape.quadraticCurveTo( w,  h,  w - r,  h)
  shape.lineTo(-w + r,  h)
  shape.quadraticCurveTo(-w,  h, -w,  h - r)
  shape.lineTo(-w, -h + r)
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  return (
    <mesh castShadow>
      <extrudeGeometry args={[shape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.055, bevelSegments: 5 }]} />
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.22}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

// ---- Facebook — badge + "f" letter extruded ----
export function FacebookScene({ isHovered }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1
    if (isHovered) {
      groupRef.current.rotation.y += 0.04
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06
    }
  })

  // "f" shape
  const fShape = new THREE.Shape()
  fShape.moveTo(-0.12, -0.42)
  fShape.lineTo(-0.12,  0.0)
  fShape.lineTo(-0.22,  0.0)
  fShape.lineTo(-0.22,  0.14)
  fShape.lineTo(-0.12,  0.14)
  fShape.lineTo(-0.12,  0.28)
  fShape.bezierCurveTo(-0.12, 0.52, 0.22, 0.52, 0.22, 0.28)
  fShape.lineTo( 0.22,  0.14)
  fShape.lineTo( 0.04,  0.14)
  fShape.lineTo( 0.04,  0.0)
  fShape.lineTo( 0.22,  0.0)
  fShape.lineTo( 0.22, -0.14)
  fShape.lineTo( 0.04, -0.14)
  fShape.lineTo( 0.04, -0.42)
  fShape.closePath()

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} />
      {isHovered && <pointLight position={[0, 0, 2.5]} intensity={2.0} color="#1877f2" />}
      <group ref={groupRef}>
        <Badge color="#1877f2" emissiveIntensity={isHovered ? 0.35 : 0} />
        <mesh position={[0.04, -0.06, 0.28]}>
          <extrudeGeometry args={[fShape, { depth: 0.1, bevelEnabled: false }]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.4} />
        </mesh>
      </group>
    </>
  )
}

// ---- Instagram — badge + camera lens rings ----
export function InstagramScene({ isHovered }) {
  const groupRef  = useRef()
  const ring1     = useRef()
  const ring2     = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.75 + 0.5) * 0.1
    if (ring1.current) ring1.current.rotation.z = t * 0.7
    if (ring2.current) ring2.current.rotation.z = -t * 0.5
    if (isHovered) {
      groupRef.current.rotation.y += 0.04
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06
    }
  })

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} />
      {isHovered && <pointLight position={[0, 0, 2.5]} intensity={2.0} color="#e05a24" />}
      <group ref={groupRef}>
        <Badge color="#e05a24" emissiveIntensity={isHovered ? 0.35 : 0} />
        {/* Outer lens ring */}
        <mesh ref={ring1} position={[0, 0, 0.3]}>
          <torusGeometry args={[0.32, 0.05, 8, 32]} />
          <meshStandardMaterial color="#fff" metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Inner lens */}
        <mesh ref={ring2} position={[0, 0, 0.32]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#fff" opacity={0.9} transparent />
        </mesh>
        {/* Dot (flash) */}
        <mesh position={[0.38, 0.38, 0.3]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </>
  )
}

// ---- LinkedIn — badge + "in" text feel (two bars) ----
export function LinkedInScene({ isHovered }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.85 + 1.2) * 0.1
    if (isHovered) {
      groupRef.current.rotation.y += 0.04
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06
    }
  })

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} />
      {isHovered && <pointLight position={[0, 0, 2.5]} intensity={2.0} color="#0f7ea3" />}
      <group ref={groupRef}>
        <Badge color="#0f7ea3" emissiveIntensity={isHovered ? 0.35 : 0} />
        {/* "i" dot */}
        <mesh position={[-0.18, 0.28, 0.3]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* "i" stem */}
        <mesh position={[-0.18, -0.08, 0.3]}>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* "n" left stem */}
        <mesh position={[0.08, -0.08, 0.3]}>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* "n" arch */}
        <mesh position={[0.24, 0.1, 0.3]}>
          <torusGeometry args={[0.16, 0.05, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* "n" right stem */}
        <mesh position={[0.4, -0.08, 0.3]}>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>
    </>
  )
}

// ---- YouTube — badge + play button triangle ----
export function YouTubeScene({ isHovered }) {
  const groupRef  = useRef()
  const playRef   = useRef()

  const playShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.22, -0.28)
    s.lineTo( 0.3,   0.0)
    s.lineTo(-0.22,  0.28)
    s.closePath()
    return s
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.9 + 2.1) * 0.1
    if (playRef.current) {
      playRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * (isHovered ? 0.12 : 0.04))
    }
    if (isHovered) {
      groupRef.current.rotation.y += 0.04
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06
    }
  })

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} />
      {isHovered && <pointLight position={[0, 0, 2.5]} intensity={2.0} color="#ff0000" />}
      <group ref={groupRef}>
        <Badge color="#cc0000" emissiveIntensity={isHovered ? 0.35 : 0} />
        {/* Play button */}
        <mesh ref={playRef} position={[0.04, 0, 0.3]}>
          <extrudeGeometry args={[playShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 }]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
        </mesh>
      </group>
    </>
  )
}

// ---- X / Twitter — badge + X shape ----
export function XScene({ isHovered }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.78 + 3.0) * 0.1
    if (isHovered) {
      groupRef.current.rotation.y += 0.04
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06
    }
  })

  // X made of two rotated boxes
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} />
      {isHovered && <pointLight position={[0, 0, 2.5]} intensity={2.0} color="#aaa" />}
      <group ref={groupRef}>
        <Badge color="#111111" emissiveIntensity={isHovered ? 0.2 : 0} />
        <mesh position={[0, 0, 0.3]} rotation={[0, 0,  Math.PI / 4]}>
          <boxGeometry args={[0.14, 0.78, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.14, 0.78, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>
    </>
  )
}

// ---- Generic canvas wrapper ----
export function SocialIconCanvas({ SceneComponent, isHovered, color }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <SceneComponent isHovered={isHovered} />
    </Canvas>
  )
}
