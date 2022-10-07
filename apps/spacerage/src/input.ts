import { KeyboardDevice, ValueControl, VectorControl } from "input-composer"

class Controller {
  devices = {
    keyboard: new KeyboardDevice()
  }

  controls = {
    move: new VectorControl(),
    aim: new VectorControl(),
    fire: new ValueControl()
  }

  update() {
    this.devices.keyboard.update()

    this.controls.move
      .apply(this.devices.keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW"))
      .deadzone(0.2)

    this.controls.aim
      .apply(
        this.devices.keyboard.getVector(
          "ArrowLeft",
          "ArrowRight",
          "ArrowDown",
          "ArrowUp"
        )
      )
      .deadzone(0.2)

    this.controls.fire.apply(this.devices.keyboard.getKey("Space"))
  }
}

export const controller = new Controller()
