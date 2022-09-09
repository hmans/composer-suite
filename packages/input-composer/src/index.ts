export * from "./functions"
export * from "./types"
import { flow } from "fp-ts/function"

const createKeyboardInput = () => {
  const keyState = new Map<string, boolean>()

  const handleKeyDown = (e: KeyboardEvent) => {
    keyState.set(e.key, true)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    keyState.set(e.key, false)
  }

  const start = () => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
  }

  const stop = () => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
  }

  const key = (key: string) => (keyState.get(key) ? 1 : 0)

  const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

  return { start, stop, key, axis }
}

const createGamepadInput = () => {
  const start = () => {}
  const stop = () => {}

  const gamepad = (index: number) => {
    const state = navigator.getGamepads()[index]
    if (!state) return undefined

    const axis = (axis: number) => state.axes[axis]

    const button = (button: number) => state.buttons[button]

    return { axis, button }
  }

  return { start, stop, gamepad }
}

export const createInput = () => {
  const keyboard = createKeyboardInput()

  const gamepad = createGamepadInput()

  const start = flow(keyboard.start, gamepad.start)
  const stop = flow(keyboard.stop, gamepad.stop)

  return {
    start,
    stop,
    keyboard,
    gamepad
  }
}
