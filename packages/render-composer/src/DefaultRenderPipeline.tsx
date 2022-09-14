import React from "react"
import * as RC from "."

export type DefaultRenderPipelineProps = {
  children?: React.ReactNode
}

export const DefaultRenderPipeline = ({
  children
}: DefaultRenderPipelineProps) => {
  return (
    <RC.EffectComposer>
      <RC.PreRenderPass />
      <RC.DepthCopyPass />
      <RC.CopyPass />
      <RC.RenderPass />

      <RC.EffectPass>
        <RC.SMAAEffect />
        <RC.SelectiveBloomEffect />
        <RC.VignetteEffect />
      </RC.EffectPass>

      {children}
    </RC.EffectComposer>
  )
}
