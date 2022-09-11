export const createKeyboardInput = () => {
  const keyState = new Map<string, boolean>()

  const handleKeyDown = (e: KeyboardEvent) => {
    keyState.set(e.key, true)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    keyState.set(e.key, false)
  }

  const start = () => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
  }

  const stop = () => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
  }

  const update = () => {}

  const key = (key: string) => (keyState.get(key) ? 1 : 0)

  const axis = (minKey: string, maxKey: string) => key(maxKey) - key(minKey)

  return { start, stop, update, key, axis }
}
