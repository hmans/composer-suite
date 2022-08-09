import { useThree } from "@react-three/fiber"
import { useMemo } from "react"
import { Mul, Uniform } from "shader-composer"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { RenderContext, SoftParticle } from "./lib/softies"
import { useDepthBuffer } from "./lib/useDepthBuffer"

export const SoftParticlesExample = () => {
  const depthSampler2D = Uniform("sampler2D", useDepthBuffer().depthTexture)

  /* TODO: extract this into sc-r3f? */
  const { gl, scene, camera } = useThree()
  const renderContext = useMemo(() => RenderContext(gl, scene, camera), [
    scene,
    camera
  ])

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
              SoftParticle(3, depthSampler2D, state.position, renderContext)
            )
          })}
        />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
