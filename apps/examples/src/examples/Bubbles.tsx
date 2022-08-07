import { between, plusMinus } from "randomish"
import { useState } from "react"
import { Add, Fresnel, Input, Mul, Smoothstep, Time } from "shader-composer"
import { MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Repeat } from "timeline-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime, ModuleFactory } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const BubbleFresnel: ModuleFactory<{ time: Input<"float"> }> = ({ time }) => (
  state
) => {
  const fresnel = Fresnel()

  return {
    ...state,
    alpha: Add(0.2, Mul(0.5, fresnel)),
    color: Add(state.color, fresnel)
  }
}

export const Bubbles = () => {
  const [{ velocity, lifetime, time, scale }] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    scale: ParticleAttribute(1 as number)
  }))

  const { ParticleProgress, ParticleAge, module: lifetimeModule } = Lifetime(
    lifetime,
    time
  )

  return (
    <group>
      <Particles>
        <icosahedronGeometry args={[1, 3]} />

        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          depthWrite={false}
          color="#ddf"
        >
          <VFX.Module module={lifetimeModule} />
          <VFX.Scale scale={scale} />
          <VFX.Scale scale={Smoothstep(1, 0.98, ParticleProgress)} />
          <VFX.Module module={BubbleFresnel({ time: ParticleAge })} />
          <VFX.Velocity velocity={velocity} time={ParticleAge} />
          <VFX.Acceleration force={new Vector3(0, 3, 0)} time={ParticleAge} />
        </VFXMaterial>

        <Repeat seconds={0.2}>
          <Emitter
            count={between(20, 50)}
            setup={({ position }) => {
              const t = time.uniform.value
              position.set(plusMinus(10), -5, plusMinus(10))
              lifetime.value.set(t, t + between(2, 5))
              velocity.value.set(plusMinus(2), between(0, 2), plusMinus(2))
              scale.value = between(0.5, 1.5)
            }}
          />
        </Repeat>
      </Particles>
    </group>
  )
}
