import { composable, modules } from "material-composer-r3f"
import { FlatStage, Layers, useRenderPipeline } from "r3f-stage"
import { useUniformUnit } from "shader-composer/r3f"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"

export const SoftParticlesExample = () => {
  const depthTexture = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <FlatStage>
      <InstancedParticles layers-mask={1 << Layers.TransparentFX}>
        <planeGeometry args={[5, 5]} />

        <composable.meshStandardMaterial
          color="hotpink"
          transparent
          depthWrite={false}
        >
          <modules.Billboard />
          <modules.Softness softness={2} depthTexture={depthTexture} />
        </composable.meshStandardMaterial>

        <Emitter limit={1} rate={Infinity} />
      </InstancedParticles>
    </FlatStage>
  )
}
