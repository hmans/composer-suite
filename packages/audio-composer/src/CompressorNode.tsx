import React, { useImperativeHandle } from "react"
import { AudioContext } from "three"
import { AudioNodeContext } from "./AudioContext"

export type CompressorNodeProps = {
  children?: React.ReactNode
} & DynamicsCompressorOptions

export const CompressorNode = React.forwardRef<
  DynamicsCompressorNode,
  CompressorNodeProps
>(({ children, ...props }, ref) => {
  const audioCtx = AudioContext.getContext()
  const parent = React.useContext(AudioNodeContext)

  const node = React.useMemo(
    () => audioCtx.createDynamicsCompressor(),
    [audioCtx]
  )

  React.useLayoutEffect(() => {
    node.connect(parent)
    // return () => node.disconnect(parent)
  }, [parent])

  useImperativeHandle(ref, () => node)

  return (
    <AudioNodeContext.Provider value={node}>
      {children}
    </AudioNodeContext.Provider>
  )
})
