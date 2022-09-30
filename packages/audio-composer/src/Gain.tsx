import React, { forwardRef, ReactNode, useLayoutEffect } from "react"
import { AudioNodeContext } from "./AudioContext"
import { useAudioNode } from "./hooks"

export type GainProps = {
  children?: ReactNode
  volume?: number
  target?: string
}

export const Gain = forwardRef<GainNode, GainProps>(
  ({ volume = 0.5, children, target }, ref) => {
    const node = useAudioNode((ctx) => ctx.createGain(), ref, target)

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
