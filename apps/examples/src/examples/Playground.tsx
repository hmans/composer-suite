import { between, plusMinus, random, upTo } from "randomish"
import { OneMinus } from "shader-composer"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import { Repeat } from "three-vfx"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles,
  VFX,
  VFXMaterial
} from "vfx-composer-r3f"

export default function Playground() {
  return (
    <group>
      <SuckyParticles />
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
    <Particles maxParticles={50000} safetyBuffer={10000}>
      <planeGeometry args={[0.05, 0.05]} />

      <VFXMaterial
        color={new Color(1, 3, 3)}
        baseMaterial={MeshStandardMaterial}
      >
        <VFX.Billboard />
        <VFX.Scale scale={particles.Progress} />
        <VFX.Velocity velocity={velocity} time={particles.Age} />
        <VFX.Acceleration force={gravity} time={particles.Age} />
        <VFX.Particles {...particles} />
      </VFXMaterial>

      <Repeat interval={1 / frequency}>
        <Emitter
          count={8000 / frequency}
          setup={({ position }) => {
            particles.setLifetime(2, random() / frequency)

            const direction = tmpVec3
              .set(5, 0, 0)
              .applyAxisAngle(UP, plusMinus(Math.PI))

            position.add(direction).add(new Vector3(0, 1, 0))

            velocity.value
              .copy(direction)
              .normalize()
              .multiplyScalar(-1)
              .multiplyScalar(between(1.5, 2))
          }}
        />
      </Repeat>
    </Particles>
  )
}
