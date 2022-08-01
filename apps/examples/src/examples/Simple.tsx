import { between, plusMinus, upTo } from "randomish"
import { useState } from "react"
import { Input, OneMinus, Time } from "shader-composer"
import { Color, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { makeParticles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const Effect = makeParticles()

export const DefaultParticleModules = ({
  color,
  gravity,
  lifetime,
  scale,
  velocity
}: {
  color?: Input<"vec3">
  gravity?: Input<"vec3">
  lifetime: ReturnType<typeof Lifetime>
  scale?: Input<"float">
  velocity?: Input<"vec3">
}) => (
  <>
    {scale !== undefined && (
      <VFX.Scale scale={OneMinus(lifetime.ParticleProgress)} />
    )}
    {velocity !== undefined && (
      <VFX.Velocity velocity={velocity} time={lifetime.ParticleAge} />
    )}
    {gravity !== undefined && (
      <VFX.Acceleration
        force={new Vector3(0, -10, 0)}
        time={lifetime.ParticleAge}
      />
    )}
    {color !== undefined && <VFX.SetColor color={color} />}
    <VFX.Module module={lifetime.module} />
  </>
)

export const Simple = () => {
  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    color: ParticleAttribute(new Color())
  }))

  const lifetime = Lifetime({
    lifetime: variables.lifetime,
    time: variables.time
  })

  return (
    <group>
      <Effect.Root maxParticles={1000}>
        <boxGeometry />

        <VFXMaterial baseMaterial={MeshStandardMaterial} color="hotpink">
          <DefaultParticleModules
            lifetime={lifetime}
            gravity={new Vector3(0, -10, 0)}
            velocity={variables.velocity}
            color={variables.color}
          />
        </VFXMaterial>
      </Effect.Root>

      <Effect.Emitter
        count={1}
        continuous
        setup={({ position, rotation }) => {
          const t = variables.time.uniform.value
          const { lifetime, velocity, color } = variables

          /* Randomize the instance transform */
          position.randomDirection().multiplyScalar(upTo(6))
          rotation.random()

          /* Write values into the instanced attributes */
          lifetime.value.set(t, t + between(1, 2))
          velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
          color.value.setRGB(Math.random(), Math.random(), Math.random())
        }}
      />
    </group>
  )
}
