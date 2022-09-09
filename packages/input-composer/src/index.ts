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

  const update = () => {}

  const key = (key: string) => (keyState.get(key) ? 1 : 0)

  const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

  return { start, stop, update, key, axis }
}

const createGamepadInput = () => {
  let states: Array<Gamepad | null> = []

  const start = () => {}
  const stop = () => {}

  const update = () => {
    const newStates = navigator.getGamepads()
    states = newStates.filter(Boolean)
  }

  const gamepad = (index: number) => {
    const state = states[index]
    if (!state) return undefined

    const axis = (axis: number) => state.axes[axis]

    const button = (button: number) => state.buttons[button]

    return { axis, button }
  }

  return { start, stop, update, gamepad }
}

export const createInput = () => {
  const keyboard = createKeyboardInput()

  const gamepad = createGamepadInput()

  const start = flow(keyboard.start, gamepad.start)
  const stop = flow(keyboard.stop, gamepad.stop)
  const update = flow(keyboard.update, gamepad.update)

  return {
    start,
    stop,
    update,
    keyboard,
    gamepad
  }
}
