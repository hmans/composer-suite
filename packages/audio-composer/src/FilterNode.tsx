import React, { forwardRef, ReactNode, useLayoutEffect } from "react"
import { AudioNodeContext } from "./AudioContext"
import { useAudioNode } from "./hooks"

export type FilterNodeProps = {
  children?: ReactNode
  type?: BiquadFilterType
  frequency?: number
}

export const FilterNode = forwardRef<BiquadFilterNode, FilterNodeProps>(
  ({ children, type = "allpass", frequency = 2000 }, ref) => {
    const node = useAudioNode((ctx) => ctx.createBiquadFilter(), ref)

    useLayoutEffect(() => {
      node.type = type
    }, [type])

    useLayoutEffect(() => {
      node.frequency.setTargetAtTime(frequency, node.context.currentTime, 0.1)
    }, [frequency])

    return (
      <AudioNodeContext.Provider value={node}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
