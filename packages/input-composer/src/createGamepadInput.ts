export type GamepadDriver = ReturnType<typeof createGamepadInput>

export type GamepadDevice = ReturnType<GamepadDriver["gamepad"]>

export const createGamepadInput = () => {
  let state = navigator.getGamepads()

  const start = () => {}
  const stop = () => {}

  const update = () => {
    state = navigator.getGamepads()
  }

  const gamepad = (index: number) => {
    const data = state[index]
    if (!data) return undefined

    /** FIGHT  */
    const axis = (axis: number) => data.axes[axis]

    const button = (button: number) => data.buttons[button].value

    return { axis, button }
  }

  return { start, stop, update, gamepad }
}
