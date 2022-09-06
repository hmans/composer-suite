import { createEvent } from "../lib/event"

export const onGamepadConnected = createEvent<Gamepad>()

const handleGamepadConnected = (e: GamepadEvent) => {
  console.debug("New gamepad connected:", e.gamepad.id)
  const device = navigator.getGamepads()[e.gamepad.index]

  if (device) {
    onGamepadConnected.emit(device)
  }
}

const handleGamepadDisconnected = (e: GamepadEvent) => {
  console.debug("Gamepad disconnected:", e.gamepad.id)
}

let started = false

const start = () => {
  if (started) return
  started = true

  window.addEventListener("gamepadconnected", handleGamepadConnected)
  window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)
}

const stop = () => {
  if (!started) return
  started = false

  window.removeEventListener("gamepadconnected", handleGamepadConnected)
  window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected)
}

start()

export { start, stop }
