import { createEvent } from "../lib/event"
import { IVector } from "../types"

export type GamepadDevice = ReturnType<typeof GamepadDevice>

/**
 * A representation of a physical gamepad device.
 *
 * @param index The index of the gamepad in the navigator.getGamepads() array.
 * @returns A gamepad device.
 */
const GamepadDevice = (index: number) => {
  const getVector =
    (horizontalAxis = 0, verticalAxis = 1) =>
    (v: IVector) => {
      const gamepad = getGamepadState(index)!
      v.x = gamepad.axes[horizontalAxis]
      v.y = -gamepad.axes[verticalAxis]
      return v
    }

  return {
    get state() {
      return getGamepadState(index)!
    },

    getVector
  }
}

/**
 * This event fires when a new gamepad is connected. It is passed
 * the numerical ID of the newly connected gamepad.
 */
export const onGamepadConnected = createEvent<GamepadDevice>()

/**
 * Retrieves the state of the specified gamepad. This is necessary in Chrome because
 * the objects returned by navigator.getGamepads() are never mutated.
 */
const getGamepadState = (index: number) => navigator.getGamepads()[index]

const handleGamepadConnected = (e: GamepadEvent) => {
  console.debug("New gamepad connected:", e.gamepad.id)
  onGamepadConnected.emit(GamepadDevice(e.gamepad.index))
}

const handleGamepadDisconnected = (e: GamepadEvent) => {
  console.debug("Gamepad disconnected:", e.gamepad.id)
}

let started = false

export const start = () => {
  if (started) return
  started = true

  window.addEventListener("gamepadconnected", handleGamepadConnected)
  window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)
}

export const stop = () => {
  if (!started) return
  started = false

  window.removeEventListener("gamepadconnected", handleGamepadConnected)
  window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected)
}

start()
