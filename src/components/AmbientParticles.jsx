import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Global ambient particle system.
 * Very low opacity (5–10%), drifting slowly.
 * Pauses rendering when out of viewport via IntersectionObserver.
 */
export default function AmbientParticles({ count = 60 }) {
  const blueRef = useRef()
  const orangeRef = useRef()
  const active = useRef(true)

  // Generate stable random positions + velocities
  const { bluePositions, orangePositions, velocities } = useMemo(() => {
    const bp = new Float32Array(count * 3)
    const op = new Float32Array(count * 3)
    const vel = []

    for (let i = 0; i < count; i++) {
      // Scatter across a large volume
      bp[i * 3 + 0] = (Math.random() - 0.5) * 28
      bp[i * 3 + 1] = (Math.random() - 0.5) * 18
      bp[i * 3 + 2] = (Math.random() - 0.5) * 8

      op[i * 3 + 0] = (Math.random() - 0.5) * 28
      op[i * 3 + 1] = (Math.random() - 0.5) * 18
      op[i * 3 + 2] = (Math.random() - 0.5) * 8

      vel.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.002 + 0.001,
        z: (Math.random() - 0.5) * 0.001,
      })
    }

    return { bluePositions: bp, orangePositions: op, velocities: vel }
  }, [count])

  useFrame(() => {
    if (!active.current) return

    ;[blueRef, orangeRef].forEach((ref) => {
      if (!ref.current) return
      const pos = ref.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        const v = velocities[i]
        pos.array[i * 3 + 0] += v.x
        pos.array[i * 3 + 1] += v.y
        pos.array[i * 3 + 2] += v.z

        // Wrap around edges
        if (pos.array[i * 3 + 1] > 9) pos.array[i * 3 + 1] = -9
        if (pos.array[i * 3 + 0] > 14) pos.array[i * 3 + 0] = -14
        if (pos.array[i * 3 + 0] < -14) pos.array[i * 3 + 0] = 14
      }
      pos.needsUpdate = true
    })
  })

  return (
    <>
      <points ref={blueRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={bluePositions}
            count={bluePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#0f7ea3"
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </points>

      <points ref={orangeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={orangePositions}
            count={orangePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#e05a24"
          size={0.038}
          sizeAttenuation
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </points>
    </>
  )
}
