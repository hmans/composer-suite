import React, { useImperativeHandle } from "react"
import { AudioContext } from "three"
import { AudioNodeContext } from "./AudioContext"
import { useAudioNode } from "./hooks"

export type CompressorNodeProps = {
  children?: React.ReactNode
} & DynamicsCompressorOptions

export const CompressorNode = React.forwardRef<
  DynamicsCompressorNode,
  CompressorNodeProps
>(({ children, ...props }, ref) => {
  const node = useAudioNode((ctx) => ctx.createDynamicsCompressor(), ref)

  return (
    <AudioNodeContext.Provider value={node}>
      {children}
    </AudioNodeContext.Provider>
  )
})
