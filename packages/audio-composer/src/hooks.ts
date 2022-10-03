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
  ref: Ref<T>,
  target?: string
) => {
  const audioCtx = AudioContext.getContext()
  const parent = useContext(AudioNodeContext)

  /* Create node */
  const node = useMemo(() => {
    return ctor(audioCtx)
  }, [])

  /* Wire up to parent */
  useLayoutEffect(() => {
    const t = target ? parent[target as keyof typeof parent] : parent

    node.connect(t as any)
    return () => node.disconnect(t as any)
  }, [node, parent, target])

  useImperativeHandle(ref, () => node)

  return node
}
