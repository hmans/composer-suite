export const useGamepadInput = (index: number) => {
  const getGamepadState = () => navigator.getGamepads()[index]

  const getButton = (buttonIndex: number) => {
    const gamepad = getGamepadState()
    return gamepad?.buttons[buttonIndex]?.pressed ? 1 : 0
  }

  const getAxis = (axis: number) => getGamepadState()?.axes[axis]

  const getVector = (axisX: number, axisY: number) => {
    const state = getGamepadState()
    if (!state) return { x: 0, y: 0 }

    return {
      x: state.axes[axisX],
      y: -state.axes[axisY]
    }
  }

  return { getGamepadState, getButton, getAxis, getVector }
}
