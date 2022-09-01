import { upTo } from "randomish"
import { OneMinus, Time } from "shader-composer"
import { makeStore } from "statery"
import {
  Color,
  MeshStandardMaterial,
  NormalBlending,
  Vector2,
  Vector3
} from "three"
import { Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Particles as ParticlesImpl } from "vfx-composer"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { createRef } from "react"

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

const ref = createRef<ParticlesImpl>()

export const BallImpactEffect = () => {
  return (
    <Particles ref={ref}>
      <planeGeometry args={[0.2, 0.2]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color={new Color(2, 2, 2)}
        blending={NormalBlending}
        transparent
      >
        <VFX.Billboard />
        <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
        <VFX.SetAlpha alpha={OneMinus(ParticleProgress)} />
        <VFX.Module module={lifetimeModule} />
      </VFXMaterial>
    </Particles>
  )
}

const direction = new Vector3()

export const ballImpact = (spawnPosition: Vector3) => {
  const particles = ref.current
  if (!particles) return

  particles.emit(100, ({ position }) => {
    direction.randomDirection()
    position
      .add(spawnPosition)
      .add(tmpVec3.copy(direction).multiplyScalar(upTo(0.3)))

    const t = variables.time.uniform.value
    variables.lifetime.value.set(t, t + 1)
    variables.velocity.value.copy(direction).multiplyScalar(upTo(5))
  })
}

// const direction = new Vector3()

// export const BallTrailEmitter = () => (
//   <BallTrail.Emitter
//     continuous
//     count={10}
//     setup={({ position }) => {
// direction.randomDirection()
// position.add(tmpVec3.copy(direction).multiplyScalar(upTo(0.3)))

// const t = variables.time.uniform.value
// variables.lifetime.value.set(t, t + 1)
// variables.velocity.value.copy(direction).multiplyScalar(upTo(5))
//     }}
//   />
// )
