import React, {
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useMemo
} from "react"
import { AudioContext } from "three"
import { AudioNodeContext } from "./AudioContext"

export type GainNodeProps = {
  children?: ReactNode
}

export const GainNode = forwardRef<GainNode, GainNodeProps>(
  ({ children }, ref) => {
    const audioCtx = AudioContext.getContext()
    const parent = useContext(AudioNodeContext)

    const gainNode = useMemo(() => {
      const gainNode = audioCtx.createGain()
      gainNode.connect(parent)
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)

      return gainNode
    }, [audioCtx])

    useImperativeHandle(ref, () => gainNode)

    return (
      <AudioNodeContext.Provider value={gainNode}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
