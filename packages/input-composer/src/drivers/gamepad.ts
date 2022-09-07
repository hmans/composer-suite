import { createEvent } from "../lib/event"
import { IDevice, IDriver } from "../types"

export type GamepadDevice = IDevice & {
  getAxis: (axis: number) => number
}

const devices = new Map<number, GamepadDevice>()

const onDeviceAppeared = createEvent<GamepadDevice>()
const onDeviceDisappeared = createEvent<GamepadDevice>()
const onDeviceActivity = createEvent<GamepadDevice>()

const getGamepadData = (index: number) => {
  const gamepad = navigator.getGamepads()[index]
  if (!gamepad) throw new Error("Gamepad not connected.")
  return gamepad
}

const createGamepadDevice = (index: number): GamepadDevice => {
  const state = {
    gamepad: getGamepadData(index)
  }

  const onActivity = createEvent()

  const update = () => {
    const gamepad = getGamepadData(index)
    if (gamepad.timestamp > state.gamepad.timestamp) {
      state.gamepad = gamepad
      onActivity.emit()
    }
  }

  const getAxis = (axis: number) => {
    return state.gamepad.axes[axis]
  }

  return { update, onActivity, getAxis }
}

const onGamepadConnected = (e: GamepadEvent) => {
  console.debug(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  )

  const device = createGamepadDevice(e.gamepad.index)
  devices.set(e.gamepad.index, device)

  onDeviceAppeared.emit(device)

  device.onActivity.addListener(() => onDeviceActivity.emit(device))
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

const update = () => {
  for (const device of devices.values()) {
    device.update()
  }
}

const driver: IDriver<GamepadDevice> = {
  start,
  stop,
  update,
  onDeviceAppeared,
  onDeviceDisappeared,
  onDeviceActivity
}

export default driver
