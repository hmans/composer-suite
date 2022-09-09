export const createGamepadInput = () => {
  const start = () => {}
  const stop = () => {}

  const gamepad = (index: number) => {
    const state = navigator.getGamepads()[index]
    if (!state) return undefined

    const axis = (axis: number) => state.axes[axis]

    const button = (button: number) => state.buttons[button].value

    return { axis, button }
  }

  return { start, stop, gamepad }
}
