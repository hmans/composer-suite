import React, { forwardRef, ReactNode, useLayoutEffect } from "react"
import { useAudioNode } from "./hooks"

export type OscillatorProps = {
  children?: ReactNode
  frequency?: number
  type?: OscillatorType
}

export const OscillatorNode = forwardRef<OscillatorNode, OscillatorProps>(
  ({ type = "sine", frequency = 440, children }, ref) => {
    const node = useAudioNode((ctx) => ctx.createOscillator(), ref)

    /* Apply props */
    node.type = type
    node.frequency.value = frequency

    useLayoutEffect(() => {
      node.start()
      return () => node.stop()
    }, [node])

    return <>{children}</>
  }
)
