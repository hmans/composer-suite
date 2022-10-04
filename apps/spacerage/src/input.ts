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

abstract class AbstractControl {}

class Stick extends AbstractControl implements IVector {
  x = 0
  y = 0

  apply(vector: IVector) {
    this.x = vector.x
    this.y = vector.y
    return this
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y)
    if (length > 0) {
      this.x /= length
      this.y /= length
    }
    return this
  }
}

class Button extends AbstractControl implements IButton {
  value = 0

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

  onPress(listener: Listener<void>) {
    if (this.isPressed) {
      listener()
    }
  }
}

abstract class AbstractController {
  abstract devices: Record<string, IDevice>
  abstract controls: Record<string, AbstractControl>
  abstract events: Record<string, Event>

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
  scheme: "gamepad" | "keyboard" = "keyboard"

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

  events = {
    onSelect: new Event()
  }

  update() {
    super.update()

    this.controls.move
      .apply(
        this.scheme === "keyboard"
          ? this.devices.keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW")
          : this.devices.gamepad.getVector(0, 1)
      )
      .normalize()

    this.controls.aim
      .apply(
        this.scheme === "keyboard"
          ? this.devices.keyboard.getVector(
              "ArrowLeft",
              "ArrowRight",
              "ArrowDown",
              "ArrowUp"
            )
          : this.devices.gamepad.getVector(2, 3)
      )
      .normalize()

    this.controls.fire
      .apply(
        this.scheme === "keyboard"
          ? this.devices.keyboard.getKey("Space")
          : this.devices.gamepad.getButton(7)
      )
      .clamp()

    this.controls.select
      .apply(this.devices.gamepad.getButton(0))
      .clamp()
      .onPress(this.events.onSelect.emit)
  }
}

export const controller = new Controller()
