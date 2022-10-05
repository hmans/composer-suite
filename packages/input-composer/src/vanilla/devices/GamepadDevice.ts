import { AbstractDevice } from "./AbstractDevice"

export class GamepadDevice extends AbstractDevice {
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
