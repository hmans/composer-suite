import React, {
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import { AudioContext } from "three"
import { AudioNodeContext } from "./AudioContext"

export type OscillatorProps = {
  children?: ReactNode
  frequency?: number
  type?: OscillatorType
}

export const OscillatorNode = forwardRef<OscillatorNode, OscillatorProps>(
  ({ type = "sine", frequency = 440, children }, ref) => {
    const audioCtx = AudioContext.getContext()

    const parent = useContext(AudioNodeContext)

    const oscillator = useMemo(() => {
      const time = audioCtx.currentTime

      const oscillator = audioCtx.createOscillator()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, time)
      oscillator.connect(parent || audioCtx.destination)

      return oscillator
    }, [audioCtx])

    useLayoutEffect(() => {
      oscillator.start()

      return () => {
        oscillator.stop()
      }
    }, [])

    useImperativeHandle(ref, () => oscillator)

    return <>{children}</>
  }
)
