import { createEvent } from "../lib/event"
import { Driver } from "../types"

const gamepadLastTimestamp = new Map<number, number>()

type GamepadDevice = Gamepad

const createGamepadDriver = (): Driver<GamepadDevice> => {
  const onDeviceAppeared = createEvent<GamepadDevice>()
  const onDeviceDisappeared = createEvent<GamepadDevice>()
  const onDeviceActivity = createEvent<GamepadDevice>()

  const onGamepadConnected = (e: GamepadEvent) => {
    console.debug(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",

      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    )

    onDeviceAppeared.emit(e.gamepad)
  }

  const onGamepadDisconnected = (e: GamepadEvent) => {
    console.debug(
      "Gamepad disconnected from index %d: %s",
      e.gamepad.index,
      e.gamepad.id
    )

    onDeviceDisappeared.emit(e.gamepad)
  }

  const start = () => {
    window.addEventListener("gamepadconnected", onGamepadConnected)
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected)
  }

  const stop = () => {
    window.removeEventListener("gamepadconnected", onGamepadConnected)
    window.removeEventListener("gamepaddisconnected", onGamepadDisconnected)
  }

  const update = () => {
    /* Iterate through all registered gamepads and check if they have been updated. */
    for (const gamepad of navigator.getGamepads()) {
      /* Gamepad may be null after disconnecting. */
      if (!gamepad) continue

      /* Compare the last timestamp with the current one. */
      if (gamepadLastTimestamp.get(gamepad.index) !== gamepad.timestamp) {
        gamepadLastTimestamp.set(gamepad.index, gamepad.timestamp)
        onDeviceActivity.emit(gamepad)
      }
    }
  }

  return {
    start,
    stop,
    update,
    onDeviceAppeared,
    onDeviceDisappeared,
    onDeviceActivity
  }
}

export default createGamepadDriver()
