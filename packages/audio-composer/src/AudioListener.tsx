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
    // listener.current.setFilter(context)
    listener.current.gain.connect(context)

    return () => {
      listener.current.gain.disconnect()
    }
  }, [listener, context])

  return <audioListener ref={listener} />
}
