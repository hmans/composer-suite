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

  const t = node.context.currentTime
  node.threshold.setValueAtTime(-50, t)
  node.knee.setValueAtTime(40, t)
  node.ratio.setValueAtTime(12, t)
  node.attack.setValueAtTime(0, t)
  node.release.setValueAtTime(0.25, t)

  return (
    <AudioNodeContext.Provider value={node}>
      {children}
    </AudioNodeContext.Provider>
  )
})
