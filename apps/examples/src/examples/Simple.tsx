import { useConst } from "@hmans/use-const"
import { useTexture } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useMemo } from "react"
import {
  $,
  Div,
  Input,
  OneMinus,
  SplitVector2,
  Sub,
  Time,
  Vec3
} from "shader-composer"
import { AdditiveBlending, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"
import { Lifetime, Module } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { particleUrl } from "./textures"

const useShaderVariables = <T extends any>(ctor: () => T) => useConst(ctor)

const useParticles = (lifetime: Input<"vec2">, time: Input<"float">) =>
  useConst(() => {
    const [StartTime, EndTime] = SplitVector2(lifetime)

    const MaxAge = Sub(EndTime, StartTime)
    const Age = Sub(time, StartTime)
    const Progress = Div(Age, MaxAge)

    const module: Module = (state) => ({
      ...state,
      color: Vec3(state.color, {
        fragment: {
          body: $`if (${Progress} < 0.0 || ${Progress} > 1.0) discard;`
        }
      })
    })

    return {
      module,
      time,
      Age,
      MaxAge,
      StartTime,
      EndTime,
      Progress
    }
  })

export const Simple = () => {
  const texture = useTexture(particleUrl)

  const variables = useShaderVariables(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3())
  }))

  const particles = useParticles(variables.lifetime, variables.time)

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
          <VFX.Scale scale={OneMinus(particles.Progress)} />
          <VFX.Velocity velocity={variables.velocity} time={particles.Age} />
          <VFX.Acceleration
            force={new Vector3(0, -2, 0)}
            time={particles.Age}
          />
          <VFX.Module module={particles.module} />
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
