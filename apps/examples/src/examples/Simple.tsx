import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo, useState } from "react"
import { Input, OneMinus, Time } from "shader-composer"
import { AdditiveBlending, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { sharedResource } from "./lib/sharedResource"
import { particleUrl } from "./textures"

const useParticleLifetime = (lifetime: Input<"vec2">, time: Input<"float">) =>
  useMemo(() => Lifetime(lifetime, time), [lifetime, time])

const SimpleMaterial = sharedResource(({ variables }: { variables: any }) => {
  const texture = useTexture(particleUrl)

  const {
    ParticleProgress,
    ParticleAge,
    module: lifetimeModule
  } = useParticleLifetime(variables.lifetime, variables.time)

  return (
    <VFXMaterial
      baseMaterial={MeshStandardMaterial}
      map={texture}
      transparent
      depthWrite={false}
      blending={AdditiveBlending}
    >
      <VFX.Billboard />
      <VFX.Scale scale={OneMinus(ParticleProgress)} />
      <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
      <VFX.Acceleration force={new Vector3(0, -2, 0)} time={ParticleAge} />
      <VFX.Module module={lifetimeModule} />
    </VFXMaterial>
  )
})

export const Simple = () => {
  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3())
  }))

  return (
    <group>
      <SimpleMaterial.Resource variables={variables} />

      <Particles maxParticles={1000} safetyBuffer={1_000}>
        <planeGeometry args={[0.2, 0.2]} />
        <SimpleMaterial />

        <Emitter
          continuous
          setup={() => {
            const t = variables.time.value
            variables.lifetime.value.set(t, t + between(1, 3))
            variables.velocity.value.set(
              plusMinus(1),
              between(1, 3),
              plusMinus(1)
            )
          }}
        />
      </Particles>
    </group>
  )
}
