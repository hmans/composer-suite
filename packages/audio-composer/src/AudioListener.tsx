import React, { useContext, useLayoutEffect, useRef } from "react"
import { AudioNodeContext } from "./AudioContext"
import { store } from "./store"

export const AudioListener = () => {
  const listener = useRef<THREE.AudioListener>(null!)

  const context = useContext(AudioNodeContext)

  useLayoutEffect(() => {
    store.set({ listener: listener.current })
    return () => {
      store.set({ listener: null })
    }
  }, [listener])

  useLayoutEffect(() => {
    if (!context) return

    // const compressor = context.createDynamicsCompressor()
    // compressor.threshold.setValueAtTime(-10, context.currentTime)
    // compressor.knee.setValueAtTime(10, context.currentTime)
    // compressor.ratio.setValueAtTime(12, context.currentTime)
    // compressor.attack.setValueAtTime(0, context.currentTime)
    // compressor.release.setValueAtTime(0.25, context.currentTime)
    // listener.current.setFilter(compressor)

    // listener.current.setFilter(context)
    listener.current.gain.connect(context)

    return () => {
      listener.current.gain.disconnect()
    }
  }, [listener, context])

  return <audioListener ref={listener} />
}
