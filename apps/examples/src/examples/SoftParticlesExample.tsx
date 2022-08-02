import { useFrame } from "@react-three/fiber"
import { Mul, Resolution, Uniform } from "shader-composer"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { CameraFar, CameraNear, SoftParticle } from "./lib/softies"
import { useDepthBuffer } from "./lib/useDepthBuffer"

export const SoftParticlesExample = () => {
  const depthSampler2D = Uniform("sampler2D", useDepthBuffer().depthTexture)

  useFrame(({ camera }) => {
    Resolution.value.set(window.innerWidth, window.innerHeight)
    CameraNear.value = camera.near
    CameraFar.value = camera.far
  })

  return (
    <Particles>
      <planeGeometry args={[20, 20]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        transparent
        depthWrite={false}
      >
        <VFX.Billboard />
        <VFX.Module
          module={(state) => ({
            ...state,
            alpha: Mul(
              state.alpha,
              SoftParticle(3, depthSampler2D, state.position)
            )
          })}
        />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
