import {
  GamepadDevice,
  KeyboardDevice,
  ValueControl,
  VectorControl
} from "input-composer"

class Controller {
  devices = {
    keyboard: new KeyboardDevice(),
    gamepad: new GamepadDevice(0)
  }

  controls = {
    move: new VectorControl(),
    aim: new VectorControl(),
    fire: new ValueControl()
  }

  activeScheme: "keyboard" | "gamepad" = "gamepad"

  constructor() {
    this.devices.gamepad.onActivity.addListener(() => {
      this.activeScheme = "gamepad"
    })

    this.devices.keyboard.onActivity.addListener(() => {
      this.activeScheme = "keyboard"
    })
  }

  update() {
    this.devices.keyboard.update()
    this.devices.gamepad.update()

    const move = {
      keyboard: this.devices.keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW"),
      gamepad: this.devices.gamepad.getVector(0, 1).invertVertical()
    }

    const aim = {
      keyboard: this.devices.keyboard.getVector(
        "ArrowLeft",
        "ArrowRight",
        "ArrowDown",
        "ArrowUp"
      ),
      gamepad: this.devices.gamepad.getVector(2, 3).invertVertical()
    }

    const fire = {
      keyboard: this.devices.keyboard.getKey("Space"),
      gamepad: this.devices.gamepad.getButton(7)
    }

    this.controls.move.apply(move[this.activeScheme]).deadzone(0.2)

    this.controls.aim.apply(aim[this.activeScheme]).deadzone(0.2)

    this.controls.fire.apply(fire[this.activeScheme])
  }
}

export const controller = new Controller()
