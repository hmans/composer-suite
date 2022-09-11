import { useConst } from "@hmans/use-const"
import { useLayoutEffect, useMemo } from "react"

export const useKeyboard = () => {
  /* Grab the keyboard state. This is managed by a separate hook. */
  const state = useKeyboardState()

  /* Return the API. */
  return useMemo(() => {
    const key = (code: string) => (state.keys.get(code) ? 1 : 0)

    const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

    const vector = (
      upKey: string,
      downKey: string,
      leftKey: string,
      rightKey: string
    ) => ({
      x: axis(leftKey, rightKey),
      y: axis(downKey, upKey)
    })

    return { key, axis, vector }
  }, [state])
}

const useKeyboardState = () => {
  const state = useConst(() => ({
    keys: new Map<string, boolean>()
  }))

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.code)
      state.keys.set(event.code, true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      state.keys.set(event.code, false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [state])

  return state
}
