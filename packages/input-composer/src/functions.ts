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

export const magnitude = (v: IVector) => Math.sqrt(v.x * v.x + v.y * v.y)
