import { flow } from "fp-ts/function"
import { createGamepadInput } from "./createGamepadInput"
import { createKeyboardInput } from "./createKeyboardInput"

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
