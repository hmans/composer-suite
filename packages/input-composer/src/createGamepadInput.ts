export type GamepadInput = {
  start: () => void
  stop: () => void
  gamepad: (index: number) => GamepadDevice | undefined
}

export type GamepadDevice = {
  axis: (axis: number) => number
  button: (button: number) => number
}

export const createGamepadInput = (): GamepadInput => {
  const start = () => {}
  const stop = () => {}

  const gamepad = (index: number): GamepadDevice | undefined => {
    const state = navigator.getGamepads()[index]
    if (!state) return undefined

    const axis = (axis: number) => state.axes[axis]

    const button = (button: number) => state.buttons[button].value

    return { axis, button }
  }

  return { start, stop, gamepad }
}
