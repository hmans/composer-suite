import { useNullableState } from "@hmans/use-nullable-state"
import * as PP from "postprocessing"
import React, { createContext, useContext } from "react"
import * as RC from "."

const RenderPipelineContext = createContext<{
  depth: THREE.Texture
  scene: THREE.Texture
}>(null!)

export const useRenderPipeline = () => useContext(RenderPipelineContext)

export type RenderPipelineProps = {
  children?: React.ReactNode
}

export const RenderPipeline = ({ children }: RenderPipelineProps) => {
  const [depthCopyPass, setDepthCopyPass] = useNullableState<PP.DepthCopyPass>()
  const [copyPass, setCopyPass] = useNullableState<PP.CopyPass>()

  /* TODO: make this a prop */
  const transparentFXLayer = 16

  return (
    <RC.EffectComposer>
      {/* Render all scene objects _except_ for those on the transparent FX layer. */}
      <RC.LayerRenderPass layerMask={~(1 << transparentFXLayer)} />
      <RC.DepthCopyPass ref={setDepthCopyPass} />
      <RC.CopyPass ref={setCopyPass} />

      {/* Render just the transparent FX objects. */}
      <RC.LayerRenderPass layerMask={1 << transparentFXLayer} />

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
