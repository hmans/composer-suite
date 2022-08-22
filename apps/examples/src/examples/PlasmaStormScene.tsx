import { useTexture } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Layers, useRenderPipeline } from "r3f-stage"
import { between, plusMinus, random } from "randomish"
import {
  Cos,
  Mul,
  OneMinus,
  Rotation3DY,
  Rotation3DZ,
  Sin,
  Time
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Color, DoubleSide, MeshStandardMaterial, Vector3 } from "three"
import { Repeat } from "timeline-composer"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"
import { smokeUrl } from "./textures"

/* TODO: extract into randomish */
const onCircle = (radius = 1) => {
  const theta = plusMinus(Math.PI)
  const x = radius * Math.cos(theta)
  const y = radius * Math.sin(theta)

  return { x, y }
}

export default function PlasmaStormScene() {
  return (
    <group>
      <SuckyParticles />
      <PlasmaBall position-y={0} scale={3} />
      <FloorEruption />
      <Fog />
    </group>
  )
}

const frequency = 5

const SuckyParticles = () => {
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())

  return (
    <Particles
      maxParticles={100000}
      safetyBuffer={3000}
      layers-mask={Layers.TransparentFX}
    >
      <planeGeometry args={[0.05, 0.05]} />

      <ComposableMaterial
        color={new Color(1, 2, 3)}
        baseMaterial={MeshStandardMaterial}
      >
        <Modules.Billboard />
        <Modules.Scale scale={particles.progress} />
        <Modules.Velocity velocity={velocity} time={particles.age} />
        <Modules.Acceleration
          force={new Vector3(0, 5, 0)}
          time={particles.age}
        />
        <Modules.Rotate
          rotation={Rotation3DY(Mul(particles.age, Cos(particles.startTime)))}
        />
        <Modules.Lifetime {...particles} />
      </ComposableMaterial>

      <Repeat seconds={1 / frequency}>
        <Emitter
          count={5000 / frequency}
          setup={({ position }) => {
            particles.setLifetime(between(1, 2), random() / frequency)

            const direction = onCircle(between(4, 5))

            position.set(direction.x, 0, direction.y)

            velocity.value
              .set(direction.x, 0, direction.y)
              .normalize()
              .multiplyScalar(-1)
              .multiplyScalar(between(1.5, 2))
          }}
        />
      </Repeat>
    </Particles>
  )
}

const FloorEruption = () => {
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())

  return (
    <Particles
      maxParticles={12000}
      safetyBuffer={5000}
      layers-mask={Layers.TransparentFX}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />

      <ComposableMaterial color="black" baseMaterial={MeshStandardMaterial}>
        <Modules.Scale scale={OneMinus(particles.progress)} />
        <Modules.Velocity velocity={velocity} time={particles.age} />
        <Modules.Acceleration
          force={new Vector3(0, 1, 0)}
          time={particles.age}
        />
        <Modules.Rotate
          rotation={Rotation3DY(Mul(particles.age, Sin(particles.startTime)))}
        />
        <Modules.Lifetime {...particles} />
      </ComposableMaterial>

      <Repeat seconds={1 / frequency}>
        <Emitter
          count={200 / frequency}
          setup={({ position }) => {
            const s = onCircle(between(3, 3.2))
            position.set(s.x, 0, s.y)
            particles.setLifetime(4, random() / frequency)

            velocity.value
              .set(position.x, 5, position.z)
              .normalize()
              .multiplyScalar(2)
          }}
        />
      </Repeat>
    </Particles>
  )
}

function PlasmaBall(props: GroupProps) {
  const time = Time()

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group {...props}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh layers-mask={Layers.TransparentFX}>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          side={DoubleSide}
        >
          <Modules.DistortSurface
            offset={Mul(time, 0.5)}
            amplitude={Mul(Cos(time), 0.2)}
          />
          <Modules.Plasma offset={Mul(time, 0.3)} />
          <Modules.Softness softness={0.5} depthTexture={depth} />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())
  const rotation = useParticleAttribute(() => 0 as number)
  const scale = useParticleAttribute(() => 1 as number)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <ComposableMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          transparent
          depthWrite={false}
        >
          <Modules.Billboard />
          <Modules.SetAlpha alpha={0.2} />
          <Modules.Rotate
            rotation={Rotation3DZ(Mul(particles.age, rotation))}
          />
          <Modules.Scale scale={scale} />
          <Modules.Velocity velocity={velocity} time={particles.age} />
          <Modules.Softness softness={5} depthTexture={depth} />
        </ComposableMaterial>

        <Repeat seconds={1 / frequency}>
          <Emitter
            count={50 / frequency}
            setup={({ position }) => {
              particles.setLifetime(6, random() / frequency)
              position.set(-10, between(0, 1), plusMinus(10))
              velocity.value.set(between(3, 10), 0, 0)
              rotation.value = plusMinus(0.2)
              scale.value = between(1, 10)
            }}
          />
        </Repeat>
      </Particles>
    </group>
  )
}
