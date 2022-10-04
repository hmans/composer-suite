import { pipe } from "fp-ts/lib/function"

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

  getButton(index: number) {
    return this.state?.buttons[index].value
  }

  getAxis(index: number) {
    return this.state?.axes[index]
  }
}

abstract class AbstractControl implements IControl {
  update(fun: (control: typeof this) => void) {
    fun(this)
  }
}

class Stick extends AbstractControl {
  x = 0
  y = 0
}

class Button extends AbstractControl {
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

    this.controls.a.update(
      (c) => (c.value = this.devices.gamepad.getButton(0) || 0)
    )

    this.controls.rightTrigger.update(
      (c) => (c.value = this.devices.gamepad.getButton(7) || 0)
    )

    this.controls.leftStick.update((c) => {
      c.x = this.devices.gamepad.getAxis(0) || 0
      c.y = -(this.devices.gamepad.getAxis(1) || 0)
    })

    this.controls.rightStick.update((c) => {
      c.x = this.devices.gamepad.getAxis(2) || 0
      c.y = -(this.devices.gamepad.getAxis(3) || 0)
    })
  }
}

export const controller = new Controller()
