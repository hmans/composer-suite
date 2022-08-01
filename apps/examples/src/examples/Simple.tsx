import { between, plusMinus, upTo } from "randomish"
import { useState } from "react"
import { OneMinus, Time } from "shader-composer"
import { Color, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Repeat } from "timeline-composer"
import { makeParticles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const Effect = makeParticles()

export const Simple = () => {
  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    color: ParticleAttribute(new Color())
  }))

  const { ParticleProgress, ParticleAge, module: lifetimeModule } = Lifetime(
    variables.lifetime,
    variables.time
  )

  return (
    <group>
      <Effect.Root maxParticles={100_000} safetyBuffer={1_000}>
        <planeGeometry />

        <VFXMaterial baseMaterial={MeshStandardMaterial} color="hotpink">
          <VFX.Scale scale={OneMinus(ParticleProgress)} />
          <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
          <VFX.Acceleration force={new Vector3(0, -10, 0)} time={ParticleAge} />
          <VFX.SetColor color={variables.color} />
          <VFX.Module module={lifetimeModule} />
        </VFXMaterial>
      </Effect.Root>

      <Repeat seconds={1}>
        <Effect.Emitter
          count={10}
          setup={({ position, rotation }) => {
            const t = variables.time.uniform.value
            const { lifetime, velocity, color } = variables

            /* Randomize the instance transform */
            position.randomDirection().multiplyScalar(upTo(6))
            rotation.random()

            /* Write values into the instanced attributes */
            const start = t
            lifetime.value.set(start, start + between(1, 3))
            velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
            color.value.setRGB(Math.random(), Math.random(), Math.random())
          }}
        />
      </Repeat>
    </group>
  )
}
