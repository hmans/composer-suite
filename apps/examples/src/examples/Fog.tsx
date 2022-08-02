import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { Mul, Rotation3DZ, Time } from "shader-composer"
import { MeshStandardMaterial, Vector3 } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture
  const texture = useTexture(smokeUrl)

  const time = Time()
  const velocity = ParticleAttribute(new Vector3())
  const rotation = ParticleAttribute(0 as number)

  const setup: InstanceSetupCallback = ({ position, scale }) => {
    position.set(plusMinus(10), between(0, 15), plusMinus(10))
    scale.setScalar(between(5, 10))
    velocity.value.randomDirection().multiplyScalar(upTo(0.01))
    rotation.value = plusMinus(0.1)
  }

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
        <VFX.Velocity velocity={velocity} time={time} />
        <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
        <VFX.Billboard />
      </VFXMaterial>

      <Emitter count={10} setup={setup} />
    </Particles>
  )
}
