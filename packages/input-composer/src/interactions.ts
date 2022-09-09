export const createPressInteraction = (callback: () => void, threshold = 1) => {
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

export const createReleaseInteraction = (
  callback: () => void,
  threshold = 1
) => {
  let released = false

  return (v: number) => {
    if (v < threshold) {
      if (!released) {
        callback()
        released = true
      }
    } else {
      released = false
    }

    return v
  }
}

// export const createHoldInteraction = (
//   callback: () => void,
//   minTime = 0.5,
//   threshold = 1
// ) => {}
