import { createEvent } from "../lib/event"
import { Driver } from "../types"

const createGamepadDriver = (): Driver => {
  const onDeviceAppeared = createEvent()
  const onDeviceDisappeared = createEvent()
  const onDeviceActivity = createEvent()

  const onGamepadConnected = (e: GamepadEvent) => {
    console.debug(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",

      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    )

    onDeviceAppeared.emit()
  }

  const onGamepadDisconnected = (e: GamepadEvent) => {
    console.debug(
      "Gamepad disconnected from index %d: %s",
      e.gamepad.index,
      e.gamepad.id
    )

    onDeviceDisappeared.emit()
  }

  const start = () => {
    window.addEventListener("gamepadconnected", onGamepadConnected)
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected)
  }

  const stop = () => {
    window.removeEventListener("gamepadconnected", onGamepadConnected)
    window.removeEventListener("gamepaddisconnected", onGamepadDisconnected)
  }

  return {
    start,
    stop,
    onDeviceAppeared,
    onDeviceDisappeared,
    onDeviceActivity
  }
}

export default createGamepadDriver()
