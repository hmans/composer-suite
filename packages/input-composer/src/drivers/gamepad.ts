import { createEvent } from "../lib/event"

export const onGamepadConnected = createEvent<number>()

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

export const getGamepad = (index: number) => navigator.getGamepads()[index]

start()
