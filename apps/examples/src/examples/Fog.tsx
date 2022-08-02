import { useTexture } from "@react-three/drei"
import { between, insideSphere, plusMinus, power, upTo } from "randomish"
import { Mul, Rotation3DZ, Time } from "shader-composer"
import { MeshStandardMaterial, Vector2, Vector3 } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime, Scale } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

const time = Time()
const lifetime = ParticleAttribute(new Vector2())
const velocity = ParticleAttribute(new Vector3())
const rotation = ParticleAttribute(0 as number)

const { ParticleProgress, ParticleAge, module: lifetimeModule } = Lifetime(
  lifetime,
  time
)

const setup: InstanceSetupCallback = ({ position, scale }) => {
  position.set(plusMinus(10), between(0, 15), plusMinus(10))
  scale.setScalar(between(5, 10))
  velocity.value.randomDirection().multiplyScalar(upTo(0.01))
  rotation.value = plusMinus(0.1)
}

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture
  const texture = useTexture(smokeUrl)

  return (
    <Particles>
      <planeGeometry />
      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        map={texture}
        transparent
        depthWrite={false}
      >
        <VFX.SetAlpha alpha={0.15} />
        <VFX.Velocity velocity={velocity} time={ParticleAge} />
        <VFX.Module
          module={(state) => ({
            ...state,
            position: Mul(
              state.position,
              Rotation3DZ(Mul(ParticleAge, rotation))
            )
          })}
        />
        <VFX.Billboard />
      </VFXMaterial>

      <Emitter count={10} setup={setup} />
    </Particles>
  )
}
