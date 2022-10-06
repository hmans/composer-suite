import { IVector } from "../types"
import { AbstractControl } from "./AbstractControl"

export class Stick extends AbstractControl implements IVector {
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
