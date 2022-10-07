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
    this.apply = this.apply.bind(this)
  }

  apply(v: IVector) {
    this.x = v.x
    this.y = v.y
    return this
  }
}

class ValueControl extends Control implements IValue {
  constructor(public value = 0) {
    super()
    this.apply = this.apply.bind(this)
  }

  apply(v: number) {
    this.value = v
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

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)

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

  private onKeyDown(e: KeyboardEvent) {
    this.keys.add(e.code)
  }

  private onKeyUp(e: KeyboardEvent) {
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

    pipe(
      this.devices.keyboard.getVector("KeyA", "KeyD", "KeyS", "KeyW"),
      this.controls.move.apply
    )

    pipe(
      this.devices.keyboard.getVector(
        "ArrowLeft",
        "ArrowRight",
        "ArrowDown",
        "ArrowUp"
      ),
      this.controls.aim.apply
    )

    pipe(this.devices.keyboard.getKey("Space"), this.controls.fire.apply)
  }
}

export const controller = new Controller()
