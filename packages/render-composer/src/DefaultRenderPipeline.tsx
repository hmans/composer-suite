import React, { createContext, useRef, useState } from "react"
import * as RC from "."
import * as PP from "postprocessing"

export type DefaultRenderPipelineProps = {
  children?: React.ReactNode
}

const DefaultRenderPipelineContext = createContext<{
  depth: THREE.Texture
  scene: THREE.Texture
}>(null!)

export const DefaultRenderPipeline = ({
  children
}: DefaultRenderPipelineProps) => {
  const [depthCopyPass, setDepthCopyPass] = useState<PP.DepthCopyPass | null>(
    null!
  )

  const [copyPass, setCopyPass] = useState<PP.CopyPass | null>(null!)

  return (
    <RC.EffectComposer>
      <RC.PreRenderPass />
      <RC.DepthCopyPass ref={setDepthCopyPass} />
      <RC.CopyPass ref={setCopyPass} />
      <RC.RenderPass />

      <RC.EffectPass>
        <RC.SMAAEffect />
        <RC.SelectiveBloomEffect />
        <RC.VignetteEffect />
      </RC.EffectPass>

      {depthCopyPass && copyPass && (
        <DefaultRenderPipelineContext.Provider
          value={{
            depth: depthCopyPass.texture,
            scene: copyPass.texture
          }}
        >
          {children}
        </DefaultRenderPipelineContext.Provider>
      )}
    </RC.EffectComposer>
  )
}
