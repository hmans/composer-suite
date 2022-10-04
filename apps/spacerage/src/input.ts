import { flow, pipe } from "fp-ts/lib/function"

interface IVector {
  x: number
  y: number
}

interface IButton {
  value: number
}

interface IDevice {
  start: () => void
  stop: () => void
  update: () => void
}

interface IControl {
  update: Function
}

class KeyboardDevice implements IDevice {
  keys = new Set<string>()

  constructor() {
    this.keydown = this.keydown.bind(this)
    this.keyup = this.keyup.bind(this)
  }

  start() {
    window.addEventListener("keydown", this.keydown)
    window.addEventListener("keyup", this.keyup)
  }

  stop() {
    window.removeEventListener("keydown", this.keydown)
    window.removeEventListener("keyup", this.keyup)
  }

  update() {}

  keydown(e: KeyboardEvent) {
    this.keys.add(e.code)
  }

  keyup(e: KeyboardEvent) {
    this.keys.delete(e.code)
  }
}

class GamepadDevice implements IDevice {
  state: Gamepad | null = null

  constructor(public index: number) {
    this.update = this.update.bind(this)
  }

  start() {}

  stop() {}

  update() {
    this.state = navigator.getGamepads()[this.index]
  }

  isActive() {
    return !!this.state
  }

  getButton(index: number) {
    return this.state?.buttons[index].value || 0
  }

  getAxis(index: number) {
    return this.state?.axes[index] || 0
  }

  getVector(horizontal: number, vertical: number) {
    return {
      x: this.getAxis(horizontal) || 0,
      y: -this.getAxis(vertical) || 0
    }
  }
}

abstract class AbstractControl implements IControl {
  update(fun: (control: typeof this) => void) {
    fun(this)
  }
}

class Stick extends AbstractControl implements IVector {
  x = 0
  y = 0
}

class Button extends AbstractControl implements IButton {
  value = 0

  isPressed() {
    return this.value > 0.5
  }
}

abstract class AbstractController {
  abstract devices: Record<string, IDevice>
  abstract controls: Record<string, IControl>

  start() {
    Object.values(this.devices).forEach((d) => d.start())
  }

  stop() {
    Object.values(this.devices).forEach((d) => d.stop())
  }

  update() {
    Object.values(this.devices).forEach((d) => d.update())
  }
}

class Controller extends AbstractController {
  devices = {
    keyboard: new KeyboardDevice(),
    gamepad: new GamepadDevice(0)
  }

  controls = {
    leftStick: new Stick(),
    rightStick: new Stick(),
    rightTrigger: new Button(),
    a: new Button()
  }

  update() {
    super.update()

    this.controls.a.update(applyButton(this.devices.gamepad.getButton(0)))

    this.controls.rightTrigger.update(
      applyButton(this.devices.gamepad.getButton(7))
    )

    this.controls.leftStick.update(
      flow(applyVector(this.devices.gamepad.getVector(0, 1)), normalize)
    )

    this.controls.rightStick.update(
      flow(applyVector(this.devices.gamepad.getVector(2, 3)), normalize)
    )
  }
}

const applyButton = (value: number) => (control: IButton) => {
  control.value = value
  return control
}

const applyVector = (v: IVector) => (control: IVector) => {
  control.x = v.x
  control.y = v.y
  return control
}

const normalize = (control: IVector) => {
  const length = Math.sqrt(control.x * control.x + control.y * control.y)

  if (length > 1) {
    control.x /= length
    control.y /= length
  }

  return control
}

export const controller = new Controller()
