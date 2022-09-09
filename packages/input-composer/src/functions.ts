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

export const clampVector =
  (limit = 1) =>
  (v: IVector) => {
    const length = Math.sqrt(v.x * v.x + v.y * v.y)

    if (length > limit) {
      v.x = (v.x / length) * limit
      v.y = (v.y / length) * limit
    }

    return v
  }

export const copyVector = (source: IVector) => (v: IVector) => {
  v.x = source.x
  v.y = source.y
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
      normalizeVector(v)
      v.x = (v.x * (length - threshold)) / (1 - threshold)
      v.y = (v.y * (length - threshold)) / (1 - threshold)
    }

    return v
  }

export const magnitude = (v: IVector) => Math.sqrt(v.x * v.x + v.y * v.y)

export const onPressed = (callback: () => void, threshold = 1) => {
  let pressed = false

  return (v: number) => {
    if (v >= threshold) {
      if (!pressed) {
        callback()
        pressed = true
      }
    } else {
      pressed = false
    }

    return v
  }
}

export function isVector(v: any): v is IVector {
  return v && v.x !== undefined && v.y !== undefined
}
