type KeyboardDriver = ReturnType<typeof createKeyboard>
type GamepadDriver = ReturnType<typeof createGamepad>

type Input = { keyboard: KeyboardDriver; gamepad: GamepadDriver }

const createKeyboard = () => {
  const keys = new Set<string>()

  const key = (code: string) => (keys.has(code) ? 1 : 0)

  const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

  const vector = (
    upKey: string,
    downKey: string,
    leftKey: string,
    rightKey: string
  ) => ({
    x: axis(leftKey, rightKey),
    y: axis(downKey, upKey)
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    keys.add(event.code)
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    keys.delete(event.code)
  }

  const start = () => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
  }

  const stop = () => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
  }

  return { start, stop, key, axis, vector }
}

const createGamepad = () => {}

export const createInput = () => {
  const keyboard = createKeyboard()
  const gamepad = createGamepad()
  const input = { keyboard, gamepad }

  return {
    start: () => {
      keyboard.start()
    },

    stop: () => {
      keyboard.stop()
    },

    get: () => input
  }
}
