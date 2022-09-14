import * as PP from "postprocessing"
import React, { createContext, useContext } from "react"
import * as RC from "."
import { Layers } from "./Layers"
import { useNullableState } from "./lib/useNullableState"

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

  return (
    <RC.EffectComposer>
      <RC.LayerRenderPass layer={Layers.TransparentFX} />
      <RC.DepthCopyPass ref={setDepthCopyPass} />
      <RC.CopyPass ref={setCopyPass} />
      <RC.RenderPass />

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
