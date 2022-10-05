import { GamepadDevice } from "./GamepadDevice"

export class NormalizedGamepadDevice extends GamepadDevice {
  get stickLeft() {
    return this.getVector(0, 1)
  }

  get stickRight() {
    return this.getVector(2, 3)
  }

  get triggerLeft() {
    return this.getButton(6)
  }

  get triggerRight() {
    return this.getButton(7)
  }

  get bumperLeft() {
    return this.getButton(4)
  }

  get bumperRight() {
    return this.getButton(5)
  }

  get buttonA() {
    return this.getButton(0)
  }

  get buttonB() {
    return this.getButton(1)
  }

  get buttonX() {
    return this.getButton(2)
  }

  get buttonY() {
    return this.getButton(3)
  }

  get buttonStart() {
    return this.getButton(9)
  }

  get buttonSelect() {
    return this.getButton(8)
  }

  get buttonLeftStick() {
    return this.getButton(10)
  }

  get buttonRightStick() {
    return this.getButton(11)
  }
}
