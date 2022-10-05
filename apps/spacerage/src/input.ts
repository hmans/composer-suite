class Controller extends AbstractController {
  devices = {
    keyboard: new KeyboardDevice(),
    gamepad: new NormalizedGamepadDevice(0)
  }

  controls = {
    move: new Stick(),
    aim: new Stick(),
    fire: new Button(),
    select: new Button()
  }

  schemes = {
    gamepad: new Scheme([this.devices.gamepad], () => {
      this.controls.move.apply(this.devices.gamepad.stickLeft)
      this.controls.aim.apply(this.devices.gamepad.stickRight)
      this.controls.fire.apply(this.devices.gamepad.triggerRight)
      this.controls.select.apply(this.devices.gamepad.buttonA)
    }),

    keyboard: new Scheme([this.devices.keyboard], () => {
      this.controls.move.apply(
        this.devices.keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW")
      )

      this.controls.aim.apply(
        this.devices.keyboard.getVector(
          "ArrowLeft",
          "ArrowRight",
          "ArrowDown",
          "ArrowUp"
        )
      )

      this.controls.fire.apply(this.devices.keyboard.getKey("Space"))

      this.controls.select.apply(this.devices.keyboard.getKey("Enter"))
    })
  }

  constructor() {
    super()

    this.devices.keyboard.onActivity.addListener(() => {
      this.scheme = "keyboard"
    })

    this.devices.gamepad.onActivity.addListener(() => {
      this.scheme = "gamepad"
    })
  }

  process() {
    this.controls.move.clampLength().deadzone(0.1)
    this.controls.aim.clampLength().deadzone(0.1)
  }
}

export const controller = new Controller()
