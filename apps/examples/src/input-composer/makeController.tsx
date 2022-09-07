import { identity, pipe } from "fp-ts/lib/function"
import {
  applyDeadzone,
  clampVector,
  getGamepadVector,
  getKeyboardVector,
  IDevice,
  resetVector
} from "input-composer"
import gamepadDriver, { GamepadDevice } from "input-composer/drivers/gamepad"
import keyboardDriver, { KeyboardDevice } from "input-composer/drivers/keyboard"

export const makeController = () => {
  const state = {
    keyboard: null as KeyboardDevice | null,
    gamepad: null as GamepadDevice | null,
    activeDevice: null as IDevice | null
  }

  const controls = {
    move: { x: 0, y: 0 }
  }

  const setActiveDevice = (device: IDevice) => {
    if (state.activeDevice === device) return
    console.log("Switching active device to:", device)
    state.activeDevice = device
  }

  gamepadDriver.start()
  keyboardDriver.start()

  gamepadDriver.onDeviceAppeared.addListener((gamepad) => {
    state.gamepad = gamepad
    state.gamepad.onActivity.addListener(() => setActiveDevice(gamepad))
  })

  keyboardDriver.onDeviceAppeared.addListener((keyboard) => {
    state.keyboard = keyboard
    state.keyboard.onActivity.addListener(() => setActiveDevice(keyboard))
  })

  return {
    move: () =>
      pipe(
        controls.move,
        resetVector,

        state.gamepad && state.activeDevice === state.gamepad
          ? getGamepadVector(state.gamepad, 0, 1)
          : identity,

        state.keyboard && state.activeDevice === state.keyboard
          ? getKeyboardVector(state.keyboard, "w", "s", "a", "d")
          : identity,

        applyDeadzone(0.1),
        clampVector
      )
  }
}
