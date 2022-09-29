import React from "react"
import { AudioNodeContext } from "./AudioContext"
import { useAudioNode } from "./hooks"

export type CompressorProps = {
  children?: React.ReactNode
} & DynamicsCompressorOptions

export const Compressor = React.forwardRef<
  DynamicsCompressorNode,
  CompressorProps
>(({ children, ...props }, ref) => {
  const node = useAudioNode((ctx) => ctx.createDynamicsCompressor(), ref)

  node.threshold.setValueAtTime(-50, node.context.currentTime)
  node.knee.setValueAtTime(40, node.context.currentTime)
  node.ratio.setValueAtTime(12, node.context.currentTime)
  node.attack.setValueAtTime(0, node.context.currentTime)
  node.release.setValueAtTime(0.25, node.context.currentTime)

  return (
    <AudioNodeContext.Provider value={node}>
      {children}
    </AudioNodeContext.Provider>
  )
})
