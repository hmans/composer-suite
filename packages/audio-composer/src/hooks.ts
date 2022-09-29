import {
  Ref,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo
} from "react"
import { useStore } from "statery"
import { AudioContext } from "three"
import { AudioNodeContext } from "./AudioContext"
import { store } from "./store"

export const useAudioComposer = () => useStore(store)

export const useAudioContext = () => useContext(AudioNodeContext)

export const useAudioNode = <T extends AudioNode>(
  ctor: (audioContext: AudioContext) => T,
  ref: Ref<T>
) => {
  const audioCtx = AudioContext.getContext()
  const parent = useContext(AudioNodeContext)

  /* Create node */
  const node = useMemo(() => {
    return ctor(audioCtx)
  }, [audioCtx])

  /* Wire up to parent */
  useLayoutEffect(() => {
    node.connect(parent)
    // return () => node.disconnect(parent)
  }, [parent])

  useImperativeHandle(ref, () => node)

  return node
}
