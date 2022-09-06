const keys: Record<string, boolean> = {}

const onKeyDown = (e: KeyboardEvent) => {
  keys[e.key] = true
}

const onKeyUp = (e: KeyboardEvent) => {
  keys[e.key] = false
}

const isPressed = (key: string) => (keys[key] ? 1 : 0)

const isReleased = (key: string) => (keys[key] ? 0 : 1)

let started = false

const start = () => {
  if (started) return
  started = true
  window.addEventListener("keydown", onKeyDown)
  window.addEventListener("keyup", onKeyUp)
}

const stop = () => {
  if (!started) return
  started = false
  window.removeEventListener("keydown", onKeyDown)
  window.removeEventListener("keyup", onKeyUp)
}

const getAxis = (negative: string, positive: string) =>
  isPressed(positive) - isPressed(negative)

const getKeyboardDevice = () => {
  if (!started) start()

  return {
    isPressed,
    isReleased,
    getAxis
  }
}

export type Keyboard = ReturnType<typeof getKeyboardDevice>

export { getKeyboardDevice, start, stop }
