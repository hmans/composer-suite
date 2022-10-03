import React, { forwardRef, ReactNode, useLayoutEffect, useMemo } from "react"
import { AudioNodeContext } from "./AudioContext"
import { useAudioContext, useAudioNode } from "./hooks"

export type ReverbProps = {
  children?: ReactNode
  seconds?: number
  decay?: number
  reverse?: boolean
  wet?: number
}

export const Reverb = forwardRef<ConvolverNode, ReverbProps>(
  ({ wet = 0.5, seconds = 3, decay = 2, reverse = false, children }, ref) => {
    const node = useAudioNode((ctx) => ctx.createConvolver(), ref)

    /* Build the reverb buffer */
    useLayoutEffect(() => {
      const rate = node.context.sampleRate,
        length = rate * seconds,
        impulse = node.context.createBuffer(2, length, rate),
        impulseL = impulse.getChannelData(0),
        impulseR = impulse.getChannelData(1)

      for (let i = 0; i < length; i++) {
        const n = reverse ? length - i : i
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
      }

      node.buffer = impulse
    }, [seconds, decay, reverse])

    /* For now, also connect the input to our own output */
    const input = useMemo(() => {
      const input = node.context.createGain()
      input.connect(node)
      return input
    }, [node])

    /* Connect input to parent, too */
    const parent = useAudioContext()
    useLayoutEffect(() => {
      input.connect(parent)
    }, [input, parent])

    return (
      <AudioNodeContext.Provider value={input}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
