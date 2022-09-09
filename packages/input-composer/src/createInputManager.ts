import { flow } from "fp-ts/function"
import { createGamepadInput } from "./createGamepadInput"
import { createKeyboardInput } from "./createKeyboardInput"

export type InputManager = ReturnType<typeof createInputManager>

export const createInputManager = () => {
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
