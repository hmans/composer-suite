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

export type GainNodeProps = {
  children?: ReactNode
  volume?: number
}

export const GainNode = forwardRef<GainNode, GainNodeProps>(
  ({ volume = 0.5, children }, ref) => {
    const audioCtx = AudioContext.getContext()
    const parent = useContext(AudioNodeContext)

    const gainNode = useMemo(() => {
      const gainNode = audioCtx.createGain()
      gainNode.connect(parent)

      return gainNode
    }, [audioCtx])

    useLayoutEffect(() => {
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
    }, [volume])

    useImperativeHandle(ref, () => gainNode)

    return (
      <AudioNodeContext.Provider value={gainNode}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
