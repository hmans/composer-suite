import { Event } from "../../lib/event"
import { IButton } from "../../types"
import { AbstractControl } from "./AbstractControl"

export class Button extends AbstractControl implements IButton {
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
