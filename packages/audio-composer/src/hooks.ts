import { useStore } from "statery"
import { store } from "./store"

export const useAudioComposer = () => useStore(store)
