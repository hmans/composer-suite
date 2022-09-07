import { GamepadDevice } from "./drivers/gamepad"
import { KeyboardDevice } from "./drivers/keyboard"
import { IVector } from "./types"

export const resetVector = (v: IVector) => {
  v.x = 0
  v.y = 0

  return v
}

export const normalizeVector = (v: IVector) => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y)

  if (length > 0) {
    v.x /= length
    v.y /= length
  }

  return v
}

export const clampVector = (v: IVector) => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y)

  if (length > 1) {
    v.x /= length
    v.y /= length
  }

  return v
}

export const applyDeadzone =
  (threshold = 0.1) =>
  (v: IVector) => {
    const length = Math.sqrt(v.x * v.x + v.y * v.y)

    if (length < threshold) {
      v.x = 0
      v.y = 0
    } else {
      v.x = (v.x - threshold) / (1 - threshold)
      v.y = (v.y - threshold) / (1 - threshold)
    }

    return v
  }

export const getGamepadVector =
  (gamepad: GamepadDevice, horizontalAxis = 0, verticalAxis = 1) =>
  (v: IVector) => {
    v.x = gamepad.getAxis(horizontalAxis)
    v.y = -gamepad.getAxis(verticalAxis)
    return v
  }

export const getKeyboardVector =
  (
    keyboard: KeyboardDevice,
    up: string,
    down: string,
    left: string,
    right: string
  ) =>
  (v: IVector) => {
    v.x = keyboard.isPressed(right) - keyboard.isPressed(left)
    v.y = keyboard.isPressed(up) - keyboard.isPressed(down)
    return v
  }
