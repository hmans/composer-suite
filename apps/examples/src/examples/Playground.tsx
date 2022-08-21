import { useConst } from "@hmans/use-const"
import { useTexture } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { Layers, useRenderPipeline } from "r3f-stage"
import { between, plusMinus, random, upTo } from "randomish"
import {
  Time,
  Mul,
  Cos,
  Rotation3DZ,
  Rotation3DY,
  Sin,
  OneMinus
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Color, DoubleSide, MeshStandardMaterial, Vector3 } from "three"
import { Repeat } from "three-vfx"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles,
  VFX,
  VFXMaterial
} from "vfx-composer-r3f"
import { smokeUrl } from "./textures"

/* TODO: extract into randomish */
const onCircle = (radius = 1) => {
  const theta = plusMinus(Math.PI)
  const x = radius * Math.cos(theta)
  const y = radius * Math.sin(theta)

  return { x, y }
}

export default function Playground() {
  return (
    <group>
      <SuckyParticles />
      <PlasmaBall position-y={3.5} scale={2.7} />
      <FloorEruption />
      <Fog />
    </group>
  )
}

const tmpVec3 = new Vector3()
const UP = new Vector3(0, 1, 0)
const gravity = new Vector3(0, -1, 0)

const frequency = 5

const SuckyParticles = () => {
  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())

  return (
    <Particles
      maxParticles={50000}
      safetyBuffer={10000}
      layers-mask={Layers.TransparentFX}
    >
      <planeGeometry args={[0.05, 0.05]} />

      <VFXMaterial
        color={new Color(1, 2, 3)}
        baseMaterial={MeshStandardMaterial}
      >
        <VFX.Billboard />
        <VFX.Scale scale={particles.Progress} />
        <VFX.Velocity velocity={velocity} time={particles.Age} />
        <VFX.Acceleration force={new Vector3(0, 5, 0)} time={particles.Age} />
        <VFX.Rotate
          rotation={Rotation3DY(Mul(particles.Age, Cos(particles.StartTime)))}
        />
        <VFX.Particles {...particles} />
      </VFXMaterial>

      <Repeat interval={1 / frequency}>
        <Emitter
          count={3000 / frequency}
          setup={({ position }) => {
            particles.setLifetime(2, random() / frequency)

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

      <VFXMaterial color="black" baseMaterial={MeshStandardMaterial}>
        <VFX.Scale scale={OneMinus(particles.Progress)} />
        <VFX.Velocity velocity={velocity} time={particles.Age} />
        <VFX.Acceleration force={new Vector3(0, -1, 0)} time={particles.Age} />
        <VFX.Rotate
          rotation={Rotation3DY(Mul(particles.Age, Sin(particles.StartTime)))}
        />
        <VFX.Particles {...particles} />
      </VFXMaterial>

      <Repeat interval={1 / frequency}>
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

  return (
    <group {...props}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          side={DoubleSide}
        >
          <VFX.DistortSurface
            offset={Mul(time, 0.5)}
            amplitude={Mul(Cos(time), 0.2)}
          />
          <VFX.Plasma offset={Mul(time, 0.3)} />
        </VFXMaterial>
      </mesh>
    </group>
  )
}

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const time = useConst(() => Time())
  const velocity = useParticleAttribute(() => new Vector3())
  const rotation = useParticleAttribute(() => 0 as number)
  const scale = useParticleAttribute(() => 1 as number)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          transparent
          depthWrite={false}
        >
          <VFX.SetAlpha alpha={0.2} />
          <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
          <VFX.Scale scale={scale} />
          <VFX.Velocity velocity={velocity} time={time} />
          <VFX.Billboard />
          <VFX.SoftParticles softness={5} depthTexture={depth} />
        </VFXMaterial>

        <Emitter
          count={50}
          setup={({ position }) => {
            position.set(plusMinus(3), between(-2, 4), plusMinus(3))
            velocity.value.randomDirection().multiplyScalar(upTo(0.05))
            rotation.value = plusMinus(0.2)
            scale.value = between(1, 10)
          }}
        />
      </Particles>
    </group>
  )
}
