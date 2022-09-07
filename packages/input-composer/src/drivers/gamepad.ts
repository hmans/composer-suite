import { createEvent } from "../lib/event"
import { IDriver } from "../types"

type GamepadDevice = ReturnType<typeof createDevice>

const devices = new Map<number, GamepadDevice>()

const onDeviceAppeared = createEvent<GamepadDevice>()
const onDeviceDisappeared = createEvent<GamepadDevice>()
const onDeviceActivity = createEvent<GamepadDevice>()

const createDevice = (index: number) => ({ index })

const onGamepadConnected = (e: GamepadEvent) => {
  console.debug(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  )

  const device = createDevice(e.gamepad.index)
  devices.set(device.index, device)

  onDeviceAppeared.emit(device)
}

const onGamepadDisconnected = (e: GamepadEvent) => {
  console.debug(
    "Gamepad disconnected from index %d: %s",
    e.gamepad.index,
    e.gamepad.id
  )

  const device = devices.get(e.gamepad.index)
  if (!device) throw new Error("Gamepad disconnected that was never connected.")

  onDeviceDisappeared.emit(device)
  devices.delete(e.gamepad.index)
}

let started = false

const start = () => {
  if (started) return
  window.addEventListener("gamepadconnected", onGamepadConnected)
  window.addEventListener("gamepaddisconnected", onGamepadDisconnected)
}

const stop = () => {
  if (!started) return
  window.removeEventListener("gamepadconnected", onGamepadConnected)
  window.removeEventListener("gamepaddisconnected", onGamepadDisconnected)
}

const update = () => {}

const driver: IDriver<GamepadDevice> = {
  start,
  stop,
  update,
  onDeviceAppeared,
  onDeviceDisappeared,
  onDeviceActivity
}

export default driver
