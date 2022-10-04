/* TODO: extract into @hmans/things */

export type Listener<P> = (payload: P) => void

class Event<P = void> {
  listeners = new Set<Listener<P>>()

  constructor() {
    this.emit = this.emit.bind(this)
  }

  addListener(listener: Listener<P>) {
    this.listeners.add(listener)
    return () => this.removeListener(listener)
  }

  removeListener(listener: Listener<P>) {
    this.listeners.delete(listener)
  }

  emit(payload: P) {
    for (const listener of this.listeners) {
      listener(payload)
    }
  }
}

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

  getKey(code: string) {
    return this.keys.has(code) ? 1 : 0
  }

  getAxis(minKey: string, maxKey: string) {
    return this.getKey(maxKey) - this.getKey(minKey)
  }

  getVector(
    xMinKey: string,
    xMaxKey: string,
    yMinKey: string,
    yMaxKey: string
  ) {
    return {
      x: this.getAxis(xMinKey, xMaxKey),
      y: this.getAxis(yMinKey, yMaxKey)
    }
  }

  private keydown(e: KeyboardEvent) {
    this.keys.add(e.code)
  }

  private keyup(e: KeyboardEvent) {
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

abstract class AbstractControl {
  abstract updateEvents(): void
}

class Stick extends AbstractControl implements IVector {
  x = 0
  y = 0

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  apply(vector: IVector) {
    this.x = vector.x
    this.y = vector.y
    return this
  }

  normalize() {
    const length = this.length()
    if (length > 0) {
      this.x /= length
      this.y /= length
    }
    return this
  }

  clampLength(limit = 1) {
    const length = this.length()
    if (length > limit) {
      this.x /= length
      this.y /= length
    }
    return this
  }

  deadzone(threshold = 0.15) {
    const length = this.length()

    if (length < threshold) {
      this.x = 0
      this.y = 0
    } else {
      this.normalize()
      this.x = (this.x * (length - threshold)) / (1 - threshold)
      this.y = (this.y * (length - threshold)) / (1 - threshold)
    }

    return this
  }

  updateEvents() {}
}

class Button extends AbstractControl implements IButton {
  value = 0

  onPress = new Event()

  private lastValue = 0

  updateEvents() {
    if (this.isPressed) {
      if (this.lastValue == 0) {
        this.lastValue = this.value
        this.onPress.emit()
      }
    } else {
      this.lastValue = 0
    }
  }

  apply(value: number) {
    this.value = value
    return this
  }

  clamp(min = 0, max = 1) {
    this.value = Math.max(min, Math.min(max, this.value))
    return this
  }

  get isPressed() {
    return this.value > 0.5
  }
}

abstract class AbstractController {
  abstract devices: Record<string, IDevice>
  abstract controls: Record<string, AbstractControl>
  abstract schemes: Record<string, Function>

  start() {
    Object.values(this.devices).forEach((d) => d.start())
  }

  stop() {
    Object.values(this.devices).forEach((d) => d.stop())
  }

  update() {
    Object.values(this.devices).forEach((d) => d.update())
    Object.values(this.controls).forEach((c) => c.updateEvents())
  }
}

class Controller extends AbstractController {
  scheme: "gamepad" | "keyboard" = "gamepad"

  devices = {
    keyboard: new KeyboardDevice(),
    gamepad: new GamepadDevice(0)
  }

  controls = {
    move: new Stick(),
    aim: new Stick(),
    fire: new Button(),
    select: new Button()
  }

  schemes = {
    gamepad: () => {
      const {
        controls: { move, aim, fire, select },
        devices: { gamepad }
      } = this

      move.apply(gamepad.getVector(0, 1))
      aim.apply(gamepad.getVector(2, 3))
      fire.apply(gamepad.getButton(7))
      select.apply(gamepad.getButton(0))
    },

    keyboard: () => {
      const {
        controls: { move, aim, fire, select },
        devices: { keyboard }
      } = this

      move.apply(keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW"))
      aim.apply(
        keyboard.getVector("ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp")
      )
      fire.apply(keyboard.getKey("Space"))
      select.apply(keyboard.getKey("Enter"))
    }
  }

  update() {
    super.update()

    /* Gather input, depending on active control scheme */
    this.schemes[this.scheme]()

    /* Do additional processing */
    this.controls.move.clampLength().deadzone(0.1)
    this.controls.aim.clampLength().deadzone(0.1)
  }
}

export const controller = new Controller()
