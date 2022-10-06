import { pipe } from "fp-ts/lib/function"

export interface IVector {
  x: number
  y: number
}

type KeyboardDevice = ReturnType<typeof createKeyboardDevice>

export const createKeyboardDevice = () => {
  const keys = new Set()

  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.code)
  }

  const onKeyUp = (e: KeyboardEvent) => {
    keys.delete(e.code)
  }

  window.addEventListener("keydown", onKeyDown)
  window.addEventListener("keyup", onKeyUp)

  const dispose = () => {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
  }

  const getKey = (key: string) => (keys.has(key) ? 1 : 0)

  return { dispose, getKey }
}

export const getKeyboardAxis =
  (minKey: string, maxKey: string) =>
  ({ getKey }: KeyboardDevice) =>
    getKey(maxKey) - getKey(minKey)

export const getKeyboardVector =
  (leftKey: string, rightKey: string, upKey: string, downKey: string) =>
  (keyboard: KeyboardDevice) => ({
    x: getKeyboardAxis(leftKey, rightKey)(keyboard),
    y: getKeyboardAxis(downKey, upKey)(keyboard)
  })

const createSpaceRageController = () => {
  const devices = {
    keyboard: createKeyboardDevice()
  }

  const controls = {
    move: { x: 0, y: 0 },
    aim: { x: 0, y: 0 },
    fire: 0
  }

  const update = () => {
    controls.move = pipe(
      devices.keyboard,
      getKeyboardVector("KeyA", "KeyD", "KeyW", "KeyS")
    )

    controls.aim = pipe(
      devices.keyboard,
      getKeyboardVector("ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown")
    )

    controls.fire = devices.keyboard.getKey("Space")
  }

  const dispose = () => {}

  return { controls, update, dispose }
}

export const controller = createSpaceRageController()
