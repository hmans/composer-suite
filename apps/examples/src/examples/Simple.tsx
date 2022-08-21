import { useConst } from "@hmans/use-const"
import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo } from "react"
import { Input, OneMinus, Time } from "shader-composer"
import { AdditiveBlending, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { particleUrl } from "./textures"

const useShaderVariables = (ctor: () => any) => useConst(ctor)

const useParticleLifetime = (lifetime: Input<"vec2">, time: Input<"float">) =>
  useMemo(() => Lifetime(lifetime, time), [lifetime, time])

export const Simple = () => {
  const texture = useTexture(particleUrl)

  const variables = useShaderVariables(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3())
  }))

  const {
    ParticleProgress,
    ParticleAge,
    module: lifetimeModule
  } = useParticleLifetime(variables.lifetime, variables.time)

  return (
    <group>
      <Particles maxParticles={1_000} safetyBuffer={1_000}>
        <planeGeometry args={[0.2, 0.2]} />
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
