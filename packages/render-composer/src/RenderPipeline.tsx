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
  const [depthPass, setDepthPass] = useNullableState<PP.DepthCopyPass>()
  const [scenePass, setScenePass] = useNullableState<PP.CopyPass>()
  const [fxPass, setFxPass] = useNullableState<PP.CopyPass>()

  return (
    <RC.EffectComposer>
      {/* Render all scene objects _except_ for those on the transparent FX layer: */}
      <RC.LayerRenderPass
        layerMask={camera.layers.mask & ~(1 << transparentFXLayer)}
      />

      {/* Steal the render and depth textures for later: */}
      <RC.DepthCopyPass ref={setDepthPass} />
      <RC.CopyPass ref={setScenePass} />

      {/* Render the transparent FX objects on top: */}
      <RC.LayerRenderPass
        layerMask={1 << transparentFXLayer}
        ignoreBackground
      />
      <RC.CopyPass ref={setFxPass} />

      <RC.EffectPass>
        {scenePass && <RC.TextureEffect texture={scenePass.texture} />}
        {fxPass && (
          <RC.TextureEffect
            texture={fxPass.texture}
            blendFunction={PP.BlendFunction.NORMAL}
          />
        )}
      </RC.EffectPass>

      {depthPass && scenePass && (
        <RenderPipelineContext.Provider
          value={{
            depth: depthPass.texture,
            scene: scenePass.texture
          }}
        >
          {children}
        </RenderPipelineContext.Provider>
      )}
    </RC.EffectComposer>
  )
}
