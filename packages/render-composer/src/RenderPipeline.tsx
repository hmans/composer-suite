import { useNullableState } from "@hmans/use-nullable-state"
import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import React, { createContext, useContext, useMemo } from "react"
import * as RC from "."

const RenderPipelineContext = createContext<{
  depth: THREE.Texture
  scene: THREE.Texture
}>(null!)

export const useRenderPipeline = () => useContext(RenderPipelineContext)

export type RenderPipelineProps = {
  children?: React.ReactNode
  transparentFXLayer: number
}

export const RenderPipeline = ({
  children,
  transparentFXLayer
}: RenderPipelineProps) => {
  const camera = useThree((s) => s.camera)
  const [depthCopyPass, setDepthCopyPass] = useNullableState<PP.DepthCopyPass>()
  const [copyPass, setCopyPass] = useNullableState<PP.CopyPass>()
  const [fxPass, setFxPass] = useNullableState<PP.CopyPass>()

  const cameraLayerMask = useMemo(() => camera.layers.mask, [camera])

  return (
    <RC.EffectComposer>
      {/* Render all scene objects _except_ for those on the transparent FX layer: */}
      <RC.LayerRenderPass
        layerMask={cameraLayerMask & ~(1 << transparentFXLayer)}
      />

      {/* Steal the render and depth textures for later: */}
      <RC.DepthCopyPass ref={setDepthCopyPass} />
      <RC.CopyPass ref={setCopyPass} />

      {/* Render the transparent FX objects on top: */}
      <RC.LayerRenderPass
        layerMask={1 << transparentFXLayer}
        ignoreBackground
      />
      <RC.CopyPass ref={setFxPass} />

      <RC.EffectPass>
        {copyPass && <RC.TextureEffect texture={copyPass.texture} />}
        {fxPass && (
          <RC.TextureEffect
            texture={fxPass.texture}
            blendFunction={PP.BlendFunction.NORMAL}
          />
        )}
      </RC.EffectPass>

      {depthCopyPass && copyPass && (
        <RenderPipelineContext.Provider
          value={{
            depth: depthCopyPass.texture,
            scene: copyPass.texture
          }}
        >
          {children}
        </RenderPipelineContext.Provider>
      )}
    </RC.EffectComposer>
  )
}
