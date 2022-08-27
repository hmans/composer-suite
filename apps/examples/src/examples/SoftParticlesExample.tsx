import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Layers, useRenderPipeline } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles } from "vfx-composer-r3f"

export const SoftParticlesExample = () => {
  const depthTexture = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <Particles layers-mask={Layers.TransparentFX}>
      <planeGeometry args={[5, 5]} />

      <ComposableMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        transparent
        depthWrite={false}
      >
        <Modules.Billboard />
        <Modules.Softness softness={2} depthTexture={depthTexture} />
      </ComposableMaterial>

      <Emitter limit={1} rate={Infinity} />
    </Particles>
  )
}
