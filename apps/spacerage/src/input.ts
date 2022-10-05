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

abstract class AbstractDevice {
  onActivity = new Event()

  abstract start(): void
  abstract stop(): void
  abstract update(): void
}

class KeyboardDevice extends AbstractDevice {
  keys = new Set<string>()

  constructor() {
    super()
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
    this.onActivity.emit()
  }

  private keyup(e: KeyboardEvent) {
    this.keys.delete(e.code)
  }
}

class GamepadDevice extends AbstractDevice {
  state: Gamepad | null = null

  constructor(public index: number) {
    super()
    this.update = this.update.bind(this)
  }

  start() {
    window.addEventListener("gamepadconnected", this.onGamepadConnected)
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected)
  }

  stop() {
    window.removeEventListener("gamepadconnected", this.onGamepadConnected)
    window.removeEventListener(
      "gamepaddisconnected",
      this.onGamepadDisconnected
    )
  }

  update() {
    const allGamepads = navigator.getGamepads()
    const state = allGamepads[this.index]

    if (state?.timestamp !== this.state?.timestamp) {
      this.onActivity.emit()
    }

    this.state = state
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

  private onGamepadConnected(e: GamepadEvent) {
    console.log("New gamepad connected:", e.gamepad)
  }

  private onGamepadDisconnected(e: GamepadEvent) {}
}

abstract class AbstractControl {
  abstract update(): void
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

  update() {}
}

class Button extends AbstractControl implements IButton {
  value = 0

  onPress = new Event()

  private lastValue = 0

  update() {
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

class Scheme {
  constructor(public devices: AbstractDevice[], public update: () => void) {
    this.update = update.bind(this)
  }
}

abstract class AbstractController {
  abstract devices: Record<string, AbstractDevice>
  abstract controls: Record<string, AbstractControl>
  abstract schemes: Record<string, Scheme>

  scheme: "gamepad" | "keyboard" = "gamepad"

  start() {
    Object.values(this.devices).forEach((d) => d.start())
  }

  stop() {
    Object.values(this.devices).forEach((d) => d.stop())
  }

  process() {}

  update() {
    /* Update devices */
    Object.values(this.devices).forEach((d) => d.update())

    /* Execute control scheme */
    this.schemes[this.scheme]?.update()

    /* Process controls */
    this.process()

    /* Update control events */
    Object.values(this.controls).forEach((c) => c.update())
  }
}

class Controller extends AbstractController {
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
    gamepad: new Scheme([this.devices.gamepad], () => {
      this.controls.move.apply(this.devices.gamepad.getVector(0, 1))
      this.controls.aim.apply(this.devices.gamepad.getVector(2, 3))
      this.controls.fire.apply(this.devices.gamepad.getButton(7))
      this.controls.select.apply(this.devices.gamepad.getButton(0))
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
