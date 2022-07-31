import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, insideCircle, power, upTo } from "randomish"
import { useRef } from "react"
import { MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  SpawnSetup
} from "three-vfx"
import { Repeat } from "timeline-composer"

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
        scaleFunction="smoothstep(-0.5, 1.0, sin(v_age * 4.0))"
      />

      <Emitter
        count={2000}
        setup={(c) => {
          c.quaternion.random()
          c.position.set(0, 1, 0).applyQuaternion(c.quaternion)

          c.lifetime.duration = Infinity
          c.scale.min.set(0.1, 0.1, between(20, 25))
          c.scale.max.set(0.1, 0.1, 20 + power(3) * upTo(10))
        }}
      />
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

      <Repeat times={Infinity} seconds={0.2}>
        <Emitter
          count={between(50, 100)}
          setup={(c) => {
            c.quaternion.random()
            c.position.set(0, 1, 0).applyQuaternion(c.quaternion)
            c.velocity.copy(c.position).multiplyScalar(between(25, 30))
            c.acceleration.copy(c.velocity).multiplyScalar(-1)

            c.lifetime.duration = 2
            c.scale.min.set(0.1, 0.1, 0.1)
            c.scale.max.copy(c.scale.min)
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

const suckUpwards: SpawnSetup = (c) => {
  c.delay = upTo(0.2)

  const a = upTo(Math.PI * 2)
  c.position
    .set(Math.cos(a), 0.02, Math.sin(a))
    .multiplyScalar(between(12, 15.5))

  c.acceleration.set(c.position.x * 1, between(5, 50), c.position.z * 1)

  c.lifetime.duration = between(0.5, 1)

  const scale = between(0.2, 0.7)
  c.scale.min.setScalar(scale)
  c.scale.max.setScalar(scale / 2)

  c.color.min.set("#bbb")
  c.color.max.set("#444")
}

const GroundParticles = () => {
  return (
    <MeshParticles maxParticles={5000} safetySize={500}>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        billboard
        depthWrite={false}
        colorFunction="cubicIn(v_progress)"
      />

      <Repeat times={Infinity} seconds={0.2}>
        <Emitter count={300} setup={suckUpwards} />
      </Repeat>
    </MeshParticles>
  )
}

const GroundRocks = () => {
  return (
    <MeshParticles maxParticles={100}>
      <boxGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        colorFunction="cubicIn(v_progress)"
      />

      <Repeat times={Infinity} seconds={0.2}>
        <Emitter
          count={5}
          setup={(c, index) => {
            suckUpwards(c, index)

            c.lifetime.duration = 1

            c.quaternion.random()

            const scale = between(0.4, 0.8)
            c.scale.min.setScalar(scale)
            c.scale.max.setScalar(scale)

            c.color.min.set("#bbb")
            c.color.max.set("#888")
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

const CrumblyFloor = () => {
  return (
    <MeshParticles maxParticles={3000}>
      <boxGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        colorFunction="smoothstep(0.9, 1.0, v_progress)"
        transparent
      />

      <Emitter
        count={3000}
        setup={(c) => {
          const pos = insideCircle()
          c.position.set(pos.x * 13, between(-0.5, 0.5), pos.y * 13)
          c.lifetime.duration = Infinity
          c.quaternion.random()
          c.scale.min.set(between(1, 2), between(1, 2), between(1, 2))
          c.color.min.set("#bbb")
        }}
      />

      <Repeat seconds={1}>
        <Emitter
          count={20}
          setup={(c) => {
            const pos = insideCircle()
            c.position.set(pos.x * 13, 0, pos.y * 13)
            c.acceleration.set(-pos.x / 5, between(0.5, 1), -pos.y / 5)
            c.lifetime.duration = 5
            c.lifetime.delay = upTo(1)

            c.quaternion.random()

            c.scale.min.set(between(0.5, 1), between(0.5, 1), between(0.5, 1))
            c.scale.max.copy(c.scale.min)

            c.color.min.set("#bbb")
            c.color.max.set("#888")
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const FuzzyBlobExample = () => (
  <group>
    <group position-y={15}>
      <Float speed={3} rotationIntensity={10} floatingRange={[-0.3, 0.3]}>
        <FuzzyBlob />
      </Float>
      <Float speed={3} rotationIntensity={20} floatingRange={[-0.3, 0.3]}>
        <Sparks />
      </Float>
    </group>

    <CrumblyFloor />
    <GroundParticles />
    <GroundRocks />
  </group>
)
