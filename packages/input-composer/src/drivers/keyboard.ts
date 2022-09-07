import { createEvent } from "../lib/event"
import { IDevice, IDriver } from "../types"

export type KeyboardDevice = IDevice & {
  isPressed: (key: string) => 1 | 0
  isReleased: (key: string) => 1 | 0
}

const pressedKeys = new Set<string>()

const device: KeyboardDevice = {
  update: () => {},
  onActivity: createEvent(),
  isPressed: (key: string) => (pressedKeys.has(key) ? 1 : 0),
  isReleased: (key: string) => (pressedKeys.has(key) ? 0 : 1)
}

let isStarted = false
let isAppeared = false

const driver: IDriver<KeyboardDevice> = {
  start: () => {
    if (isStarted) return
    isStarted = true
    isAppeared = false
    window.addEventListener("keydown", onKeydown)
    window.addEventListener("keyup", onKeyup)
  },

  stop: () => {
    if (!isStarted) return
    isStarted = false
    isAppeared = false
    window.removeEventListener("keydown", onKeydown)
    window.removeEventListener("keyup", onKeyup)
  },

  update: () => {},

  onDeviceAppeared: createEvent<KeyboardDevice>(),
  onDeviceDisappeared: createEvent<KeyboardDevice>(),
  onDeviceActivity: createEvent<KeyboardDevice>()
}

const onKeydown = (event: KeyboardEvent) => {
  pressedKeys.add(event.key)

  /* Announce that the keyboard has "appeared" */
  if (!isAppeared) {
    isAppeared = true
    driver.onDeviceAppeared.emit(device)
  }

  device.onActivity.emit()
  driver.onDeviceActivity.emit(device)
}

const onKeyup = (event: KeyboardEvent) => {
  pressedKeys.delete(event.key)
  device.onActivity.emit()
  driver.onDeviceActivity.emit(device)
}

export default driver
