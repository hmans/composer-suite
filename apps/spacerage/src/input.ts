import {
  AbstractController,
  Button,
  KeyboardDevice,
  NormalizedGamepadDevice,
  Scheme,
  Stick
} from "input-composer"

class Controller extends AbstractController {
  controls = {
    move: new Stick(),
    aim: new Stick(),
    fire: new Button(),
    select: new Button()
  }

  schemes = {
    gamepad: new Scheme(
      { gamepad: new NormalizedGamepadDevice(0) },
      ({ gamepad }) => {
        this.controls.move.apply(gamepad.stickLeft)
        this.controls.aim.apply(gamepad.stickRight)
        this.controls.fire.apply(gamepad.triggerRight)
        this.controls.select.apply(gamepad.buttonA)
      }
    ),

    keyboard: new Scheme({ keyboard: new KeyboardDevice() }, ({ keyboard }) => {
      this.controls.move.apply(
        keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW")
      )

      this.controls.aim.apply(
        keyboard.getVector("ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp")
      )

      this.controls.fire.apply(keyboard.getKey("Space"))

      this.controls.select.apply(keyboard.getKey("Enter"))
    })
  }

  constructor() {
    super()

    this.schemes.gamepad.onActivity.addListener(() => {
      console.log("Switching to gamepad")
      this.scheme = this.schemes.gamepad
    })

    this.schemes.keyboard.onActivity.addListener(() => {
      console.log("Switching to keyboard")
      this.scheme = this.schemes.keyboard
    })
  }

  process() {
    this.controls.move.clampLength().deadzone(0.1)
    this.controls.aim.clampLength().deadzone(0.1)
  }
}

export const controller = new Controller()
