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

export type FilterNodeProps = {
  children?: ReactNode
  type?: BiquadFilterType
  frequency?: number
}

export const FilterNode = forwardRef<BiquadFilterNode, FilterNodeProps>(
  ({ children, type = "allpass", frequency = 2000 }, ref) => {
    const audioCtx = AudioContext.getContext()
    const parent = useContext(AudioNodeContext)

    const node = useMemo(() => audioCtx.createBiquadFilter(), [audioCtx])

    useLayoutEffect(() => {
      node.connect(parent)
    }, [parent])

    useLayoutEffect(() => {
      node.type = type
    }, [type])

    useLayoutEffect(() => {
      node.frequency.setTargetAtTime(frequency, audioCtx.currentTime, 0.1)
    }, [frequency])

    useImperativeHandle(ref, () => node)

    return (
      <AudioNodeContext.Provider value={node}>
        {children}
      </AudioNodeContext.Provider>
    )
  }
)
