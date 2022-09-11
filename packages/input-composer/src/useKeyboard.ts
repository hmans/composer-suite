import { useConst } from "@hmans/use-const"
import { useLayoutEffect, useMemo } from "react"

export const useKeyboard = () => {
  const state = useKeyboardState()

  return useMemo(() => {
    const key = (key: string) => (state.keys.get(key) ? 1 : 0)

    const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

    return { key, axis }
  }, [])
}

const useKeyboardState = () => {
  const state = useConst(() => ({
    keys: new Map<string, boolean>()
  }))

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      state.keys.set(event.key, true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      state.keys.set(event.key, false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return state
}
