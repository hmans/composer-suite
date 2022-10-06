import { pipe } from "fp-ts/lib/function"

export interface IVector {
  x: number
  y: number
}

type KeyboardDevice = ReturnType<typeof createKeyboardDevice>

export const createGamepadDevice = (index: number) => {
  const state = { gamepad: navigator.getGamepads()[index] }

  const update = () => {
    state.gamepad = navigator.getGamepads()[index]
  }

  const getButton = (button: number) => state.gamepad?.buttons[button].value

  const getAxis = (axis: number) => state.gamepad?.axes[axis]

  return { getButton, getAxis, update }
}

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

  const getAxis = (positive: string, negative: string) =>
    getKey(positive) - getKey(negative)

  const getVector = (
    positiveX: string,
    negativeX: string,
    positiveY: string,
    negativeY: string
  ) => ({
    x: getAxis(positiveX, negativeX),
    y: getAxis(positiveY, negativeY)
  })

  return { dispose, getKey, getAxis, getVector }
}

const createSpaceRageController = () => {
  const devices = {
    keyboard: createKeyboardDevice(),
    gamepad: createGamepadDevice(0)
  }

  const controls = {
    move: { x: 0, y: 0 },
    aim: { x: 0, y: 0 },
    fire: 0
  }

  const update = () => {
    devices.gamepad.update()

    const schemes = {
      keyboard: {
        move: devices.keyboard.getVector("KeyD", "KeyA", "KeyW", "KeyS"),
        aim: devices.keyboard.getVector(
          "ArrowRight",
          "ArrowLeft",
          "ArrowUp",
          "ArrowDown"
        ),
        fire: devices.keyboard.getKey("Space")
      }
    }

    Object.assign(controls, schemes.keyboard)
  }

  const dispose = () => {}

  return { controls, update, dispose }
}

export const controller = createSpaceRageController()
