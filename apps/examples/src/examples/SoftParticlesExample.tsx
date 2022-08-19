import { useRenderPipeline } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"

export const SoftParticlesExample = () => {
  const depthTexture = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <Particles>
      <planeGeometry args={[5, 5]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        transparent
        depthWrite={false}
      >
        <VFX.Billboard />
        <VFX.SoftParticles softness={2} depthTexture={depthTexture} />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
