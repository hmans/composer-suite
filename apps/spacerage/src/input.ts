import { pipe } from "fp-ts/lib/function"
import { createInput, InputState } from "input-composer/vanilla"

export const input = createInput()

let activeDevice: "keyboard" | "gamepad" = "gamepad"

const transformControls = ({ keyboard, gamepad }: InputState) => ({
  move:
    activeDevice === "keyboard"
      ? keyboard.vector("KeyW", "KeyS", "KeyA", "KeyD")
      : gamepad.gamepad(0).vector(0, 1),

  aim:
    activeDevice === "keyboard"
      ? keyboard.vector("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight")
      : gamepad.gamepad(0).vector(2, 3),

  fire:
    activeDevice === "keyboard"
      ? keyboard.key("Space")
      : gamepad.gamepad(0).button(7)
})

export const getControls = () => pipe(input.get(), transformControls)
