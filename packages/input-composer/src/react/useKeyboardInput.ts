import { useLayoutEffect } from "react"
import { useConst } from "@hmans/use-const"

export const useKeyboardInput = (onActivityCallback?: () => void) => {
  /* A map that stores the current state of all keys. */
  const keyState = useConst(() => new Map<string, boolean>())

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyState.set(e.key, true)
      onActivityCallback?.()
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState.set(e.key, false)
      onActivityCallback?.()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const isPressed = (key: string) => (keyState.get(key) ? 1 : 0)

  const getAxis = (minKey: string, maxKey: string) =>
    isPressed(maxKey) - isPressed(minKey)

  const getVector = (
    upKey: string,
    downKey: string,
    leftKey: string,
    rightKey: string
  ) => ({
    x: getAxis(leftKey, rightKey),
    y: getAxis(downKey, upKey)
  })

  return { isPressed, getAxis, getVector }
}
