import React, { useLayoutEffect, useRef } from "react"
import { store } from "./store"

export const AudioListener = () => {
  const listener = useRef<THREE.AudioListener>(null!)

  useLayoutEffect(() => {
    const { context } = listener.current

    const compressor = context.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-10, context.currentTime)
    compressor.knee.setValueAtTime(10, context.currentTime)
    compressor.ratio.setValueAtTime(12, context.currentTime)
    compressor.attack.setValueAtTime(0, context.currentTime)
    compressor.release.setValueAtTime(0.25, context.currentTime)

    listener.current.setFilter(compressor)

    store.set({ listener: listener.current })

    return () => {
      store.set({ listener: null })
    }
  }, [])

  return <audioListener ref={listener} />
}
