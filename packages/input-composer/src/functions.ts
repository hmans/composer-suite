import { Keyboard } from "./drivers/keyboard"
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

export const getKeyboardVector = (keyboard: Keyboard) => (v: IVector) => {
  v.x = keyboard.getAxis("a", "d")
  v.y = keyboard.getAxis("s", "w")
  return v
}
