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

  const getKey = (key: string) => (keyState.get(key) ? 1 : 0)

  const getAxis = (minKey: string, maxKey: string) =>
    getKey(maxKey) - getKey(minKey)

  const getVector = (
    upKey: string,
    downKey: string,
    leftKey: string,
    rightKey: string
  ) => ({
    x: getAxis(leftKey, rightKey),
    y: getAxis(downKey, upKey)
  })

  return { start, stop, getKey, getAxis, getVector }
}

const createGamepadInput = () => {
  const start = () => {}
  const stop = () => {}

  const getGamepad = (index: number) => {
    const state = navigator.getGamepads()[index]
    if (!state) return undefined

    const getAxis = (axis: number) => state.axes[axis]

    const getButton = (button: number) => state.buttons[button]

    const getVector = (horizontal: number, vertical: number) => ({
      x: +getAxis(horizontal),
      y: -getAxis(vertical)
    })

    return { getAxis, getButton, getVector }
  }

  return { start, stop, getGamepad }
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
