import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { useRef } from "react"
import {
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBlending
} from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"
import { ceilPowerOfTwo } from "three/src/math/MathUtils"

export const FuzzyBlob = ({ count = 20000, rotationSpeed = 0.4 }) => {
  const mesh = useRef<any>() // TODO: eh
  const t = useRef(0)

  useFrame((_, dt) => {
    mesh.current.rotation.x = mesh.current.rotation.y += rotationSpeed * dt
    t.current += dt
    mesh.current.scale.setScalar(1 + Math.sin(t.current * 0.5) * 0.1)
  })

  return (
    <MeshParticles maxParticles={count * 10} safetySize={3000} ref={mesh}>
      <boxGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        color="#666"
        depthTest={true}
        depthWrite={true}
        scaleFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={2000}
          setup={(c) => {
            c.quaternion.random()
            c.position.set(0, 1, 0).applyQuaternion(c.quaternion)

            c.lifetime = 1.5
            c.scale[0].set(0.1, 0.1, 0.1)

            c.scale[1].set(0.1, 0.1, 10 + upTo(15))
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const Sparks = () => {
  return (
    <MeshParticles>
      <boxGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        color="yellow"
        emissive="yellow"
        depthTest={true}
        depthWrite={true}
        scaleFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={between(5, 10)}
          setup={(c) => {
            c.quaternion.random()
            c.position.set(0, 1, 0).applyQuaternion(c.quaternion)
            c.velocity.copy(c.position).multiplyScalar(between(25, 30))
            c.acceleration.copy(c.velocity).multiplyScalar(-1)

            c.lifetime = 2
            c.scale[0].set(0.1, 0.1, 0.1)
            c.scale[1].copy(c.scale[0])
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const GroundCircle = () => {
  return (
    <MeshParticles>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        color="yellow"
        billboard
        depthTest={true}
        depthWrite={true}
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={between(100, 100)}
          setup={(c) => {
            const a = upTo(Math.PI * 2)
            c.position
              .set(Math.cos(a), 0, Math.sin(a))
              .multiplyScalar(between(10, 15))

            c.acceleration.set(-c.position.x, between(10, 20), -c.position.z)

            c.lifetime = between(0.5, 1)
            const scale = between(0.1, 0.2)
            c.scale[0].setScalar(scale)
            c.scale[1].copy(c.scale[0])
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const FuzzyBlobExample = () => (
  <group>
    <group position-y={13}>
      <FuzzyBlob />
      <Sparks />
    </group>
    <GroundCircle />
  </group>
)
