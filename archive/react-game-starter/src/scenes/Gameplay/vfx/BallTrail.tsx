import { upTo } from "randomish"
import { OneMinus, Time } from "shader-composer"
import {
  Color,
  MeshStandardMaterial,
  NormalBlending,
  Vector2,
  Vector3
} from "three"
import { makeParticles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const tmpVec3 = new Vector3()

const variables = {
  time: Time(),
  lifetime: ParticleAttribute(new Vector2()),
  velocity: ParticleAttribute(new Vector3())
}

const {
  ParticleProgress,
  ParticleAge,
  module: lifetimeModule
} = Lifetime(variables.lifetime, variables.time)

export const BallTrail = makeParticles()

export const BallTrailEffect = () => {
  return (
    <BallTrail.Root>
      <planeGeometry args={[0.1, 0.1]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color={new Color(2, 1, 2)}
        blending={NormalBlending}
        transparent
      >
        <VFX.Billboard />
        <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
        <VFX.SetAlpha alpha={OneMinus(ParticleProgress)} />
        <VFX.Module module={lifetimeModule} />
      </VFXMaterial>
    </BallTrail.Root>
  )
}

const direction = new Vector3()

export const BallTrailEmitter = () => (
  <BallTrail.Emitter
    continuous
    count={10}
    setup={({ position }) => {
      direction.randomDirection()
      position.add(tmpVec3.copy(direction).multiplyScalar(upTo(0.3)))

      const t = variables.time.uniform.value
      variables.lifetime.value.set(t, t + 1)
      variables.velocity.value.copy(direction).multiplyScalar(upTo(5))
    }}
  />
)
