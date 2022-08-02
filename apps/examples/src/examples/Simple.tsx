import { useTexture } from "@react-three/drei"
import { between, plusMinus, random, upTo } from "randomish"
import { useState } from "react"
import { OneMinus, Time } from "shader-composer"
import { MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Repeat } from "three-vfx"
import {
  Emitter,
  makeParticles,
  Particles,
  VFX,
  VFXMaterial
} from "vfx-composer/fiber"
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
          <VFX.Acceleration force={new Vector3(0, -10, 0)} time={ParticleAge} />
          <VFX.Module module={lifetimeModule} />
        </VFXMaterial>

        <Repeat interval={1}>
          <Emitter
            count={100}
            setup={({ position }) => {
              /* Randomize the instance transform */
              position.randomDirection().multiplyScalar(upTo(1))

              /* Write values into the instanced attributes */
              const t = variables.time.uniform.value
              const start = t //+ random()
              variables.lifetime.value.set(start, start + between(1, 3))
              variables.velocity.value.set(
                plusMinus(5),
                between(5, 18),
                plusMinus(5)
              )
            }}
          />
        </Repeat>
      </Particles>
    </group>
  )
}
