import { IDevice, IDriver } from "./types"

export type GamepadInput = IDriver<GamepadDevice> & {
  start: () => void
  stop: () => void
  gamepad: (index: number) => GamepadDevice | undefined
}

export type GamepadDevice = IDevice & {
  axis: (axis: number) => number
  button: (button: number) => number
}

export const createGamepadInput = (): GamepadInput => {
  let state = navigator.getGamepads()

  const start = () => {}
  const stop = () => {}

  const update = () => {
    state = navigator.getGamepads()
  }

  const gamepad = (index: number): GamepadDevice | undefined => {
    const data = state[index]
    if (!data) return undefined

    const axis = (axis: number) => data.axes[axis]

    const button = (button: number) => data.buttons[button].value

    return { axis, button }
  }

  return { start, stop, update, gamepad }
}
