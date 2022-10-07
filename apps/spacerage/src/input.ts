import { pipe } from "fp-ts/lib/function"
import { Event } from "input-composer"

abstract class Control {}

interface IVector {
  x: number
  y: number
}

interface IValue {
  value: number
}

class VectorControl extends Control implements IVector {
  constructor(public x = 0, public y = 0) {
    super()
  }

  length = () => Math.sqrt(this.x * this.x + this.y * this.y)

  apply = (v: IVector) => {
    this.x = v.x
    this.y = v.y
    return this
  }

  normalize = () => {
    const length = this.length()
    if (length > 0) {
      this.x /= length
      this.y /= length
    }
    return this
  }

  deadzone = (threshold = 0.2) => {
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
}

class ValueControl extends Control implements IValue {
  constructor(public value = 0) {
    super()
  }

  apply(v: number) {
    this.value = v
    return this
  }

  clamp(min = 0, max = 1) {
    this.value = Math.min(Math.max(this.value, min), max)
    return this
  }
}

abstract class Device {
  abstract update(): void
}

class KeyboardDevice extends Device {
  keys = new Set<string>()

  constructor() {
    super()

    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
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

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
  }
}

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
