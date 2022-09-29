import React, { forwardRef, ReactNode, useLayoutEffect } from "react"
import { AudioNodeContext } from "./AudioContext"
import { useAudioNode } from "./hooks"

export type GainNodeProps = {
  children?: ReactNode
  volume?: number
}

export const GainNode = forwardRef<GainNode, GainNodeProps>(
  ({ volume = 0.5, children }, ref) => {
    const node = useAudioNode((ctx) => ctx.createGain(), ref)

    useLayoutEffect(() => {
      node.gain.value = volume
    }, [volume])

    return (
      <AudioNodeContext.Provider value={node}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
