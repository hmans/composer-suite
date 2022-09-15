import * as PP from "postprocessing"
import React, { createContext, useContext } from "react"
import * as RC from "."
import { Layers } from "./Layers"
import { useNullableState } from "@hmans/use-nullable-state"

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
      <RC.LayerRenderPass layerMask={1 << 0} />
      <RC.DepthCopyPass ref={setDepthCopyPass} />
      <RC.CopyPass ref={setCopyPass} />
      <RC.LayerRenderPass layerMask={~(1 << 0)} />

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
