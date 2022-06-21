import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, upTo } from "randomish"
import { useRef } from "react"
import { AdditiveBlending, MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"
import { useDepthBuffer } from "./lib/useDepthBuffer"

const useTime = () => {
  const t = useRef(0)

  useFrame((_, dt) => {
    t.current += dt
  })

  return t
}

export const FuzzyBlob = ({ count = 20000, rotationSpeed = 0.4 }) => {
  const mesh = useRef<any>() // TODO: eh
  const t = useTime()

  useFrame((_, dt) => {
    mesh.current.scale.setScalar(1 + Math.sin(t.current * 1.3) * 0.1)
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
        color="#555"
        depthTest={true}
        depthWrite={true}
        scaleFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={between(50, 100)}
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
    <MeshParticles maxParticles={5000} safetySize={500}>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        billboard
        depthTest={true}
        depthWrite={false}
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={300}
          setup={(c) => {
            c.delay = upTo(0.2)

            const a = upTo(Math.PI * 2)
            c.position
              .set(Math.cos(a), 0.1, Math.sin(a))
              .multiplyScalar(between(10, 15))

            c.acceleration.set(
              -c.position.x * 1,
              between(5, 20),
              -c.position.z * 1
            )

            c.lifetime = between(0.5, 1)

            const scale = between(0.2, 0.5)
            c.scale[0].setScalar(scale)
            c.scale[1].setScalar(scale / 4)

            c.color[0].set("#bbb")
            c.color[1].set("#eed")
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const FuzzyBlobExample = () => (
  <group>
    <group position-y={13}>
      <Float speed={3} rotationIntensity={10} floatingRange={[-0.3, 0.3]}>
        <FuzzyBlob />
      </Float>
      <Float speed={3} rotationIntensity={20} floatingRange={[-0.3, 0.3]}>
        <Sparks />
      </Float>
    </group>
    <GroundCircle />
  </group>
)
