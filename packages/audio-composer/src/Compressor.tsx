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

  return (
    <AudioNodeContext.Provider value={node}>
      {children}
    </AudioNodeContext.Provider>
  )
})
