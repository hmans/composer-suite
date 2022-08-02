import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { Mul, Resolution, Rotation3DZ, Time, Uniform } from "shader-composer"
import { MeshStandardMaterial, Vector3 } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { CameraFar, CameraNear, SoftParticle } from "./lib/softies"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const depthSampler2D = Uniform("sampler2D", useDepthBuffer().depthTexture)

  const time = Time()
  const velocity = ParticleAttribute(new Vector3())
  const rotation = ParticleAttribute(0 as number)
  const scale = ParticleAttribute(1 as number)

  useFrame(({ camera }) => {
    Resolution.value.set(window.innerWidth, window.innerHeight)
    CameraNear.value = camera.near
    CameraFar.value = camera.far
  })

  const setup: InstanceSetupCallback = ({ position }) => {
    position.set(plusMinus(10), between(-4, 17), plusMinus(10))
    velocity.value.randomDirection().multiplyScalar(upTo(0.002))
    rotation.value = plusMinus(0.1)
    scale.value = between(10, 50)
  }

  return (
    <>
      <mesh position-y={13}>
        <torusKnotGeometry args={[7, 2.5, 100]} />
        <meshStandardMaterial color="hotpink" metalness={0.1} roughness={0.2} />
      </mesh>
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
          <VFX.Scale scale={scale} />

          <VFX.Billboard />

          <VFX.Module
            module={(state) => ({
              ...state,
              alpha: Mul(
                state.alpha,
                SoftParticle(10, depthSampler2D, state.position)
              )
            })}
          />
        </VFXMaterial>

        <Emitter count={50} setup={setup} />
      </Particles>
    </>
  )
}
