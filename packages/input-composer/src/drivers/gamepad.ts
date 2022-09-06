import { createEvent } from "../lib/event"

/**
 * This event fires when a new gamepad is connected. It is passed
 * the numerical ID of the newly connected gamepad.
 */
export const onGamepadConnected = createEvent<number>()

/**
 * Retrieve the gamepad state for a given gamepad index.
 *
 * @param index The index of the gamepad to retrieve.
 * @returns The gamepad state, or undefined if the gamepad is not connected.
 */
export const getGamepad = (index: number) => navigator.getGamepads()[index]

const handleGamepadConnected = (e: GamepadEvent) => {
  console.debug("New gamepad connected:", e.gamepad.id)
  onGamepadConnected.emit(e.gamepad.index)
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
