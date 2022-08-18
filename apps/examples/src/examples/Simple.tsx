import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useState } from "react"
import { OneMinus, Time } from "shader-composer"
import { MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { particleUrl } from "./textures"

export const Simple = () => {
  const texture = useTexture(particleUrl)

  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3())
  }))

  const { ParticleProgress, ParticleAge, module: lifetimeModule } = Lifetime(
    variables.lifetime,
    variables.time
  )

  return (
    <group>
      <Particles maxParticles={1000} safetyBuffer={1_000}>
        <planeGeometry />

        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          transparent
          depthWrite={false}
        >
          <VFX.Billboard />
          <VFX.Scale scale={OneMinus(ParticleProgress)} />
          <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
          <VFX.Module module={lifetimeModule} />
        </VFXMaterial>

        <Emitter
          continuous
          setup={() => {
            const t = variables.time.value
            variables.lifetime.value.set(t, t + between(1, 3))
            variables.velocity.value.set(
              plusMinus(2),
              between(2, 4),
              plusMinus(2)
            )
          }}
        />
      </Particles>
    </group>
  )
}
