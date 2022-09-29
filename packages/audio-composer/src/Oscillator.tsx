import React, { forwardRef, ReactNode, useLayoutEffect } from "react"
import { useAudioNode } from "./hooks"

export type OscillatorProps = {
  children?: ReactNode
  frequency?: number
  type?: OscillatorType
  start?: number
  duration?: number
}

export const Oscillator = forwardRef<OscillatorNode, OscillatorProps>(
  ({ type = "sine", frequency = 440, start = 0, duration, children }, ref) => {
    const node = useAudioNode((ctx) => ctx.createOscillator(), ref)

    /* Apply props */
    node.type = type
    node.frequency.value = frequency

    useLayoutEffect(() => {
      const t = node.context.currentTime
      if (typeof start === "number") node.start(t + start)
      if (typeof duration === "number") node.stop(t + start + duration)
      return () => node.stop()
    }, [node])

    return <>{children}</>
  }
)
