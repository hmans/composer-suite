import { useThree } from "@react-three/fiber"
import { Mul, Uniform } from "shader-composer"
import { MeshStandardMaterial, PerspectiveCamera } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { SoftParticle, ThreeStuff } from "./lib/softies"
import { useDepthBuffer } from "./lib/useDepthBuffer"

export const SoftParticlesExample = () => {
  const depthSampler2D = Uniform("sampler2D", useDepthBuffer().depthTexture)

  const { scene, camera } = useThree()

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
              SoftParticle(
                3,
                depthSampler2D,
                state.position,
                ThreeStuff(scene, camera as PerspectiveCamera)
              )
            )
          })}
        />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
