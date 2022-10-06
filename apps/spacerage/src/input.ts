import { Event } from "input-composer"

export interface IVector {
  x: number
  y: number
}

export const createGamepadDevice = (index: number) => {
  const onActivity = new Event()

  const state = { gamepad: navigator.getGamepads()[index] }

  const update = () => {
    const lastTimestamp = state.gamepad?.timestamp

    state.gamepad = navigator.getGamepads()[index]

    if (lastTimestamp !== state.gamepad?.timestamp) {
      onActivity.emit()
    }
  }

  const getButton = (button: number) => state.gamepad?.buttons[button].value

  const getAxis = (axis: number) => state.gamepad?.axes[axis]

  const getVector = (xAxis: number, yAxis: number) =>
    state.gamepad
      ? {
          x: getAxis(xAxis)!,
          y: -getAxis(yAxis)!
        }
      : undefined

  return { getButton, getAxis, getVector, update, onActivity }
}

export const createKeyboardDevice = () => {
  const onActivity = new Event()
  const keys = new Set()

  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.code)
    onActivity.emit()
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

  return { dispose, getKey, getAxis, getVector, onActivity }
}

const createSpaceRageController = () => {
  let activeScheme: "keyboard" | "gamepad" = "keyboard"

  const devices = {
    keyboard: createKeyboardDevice(),
    gamepad: createGamepadDevice(0)
  }

  const controls = {
    move: { x: 0, y: 0 },
    aim: { x: 0, y: 0 },
    fire: 0
  }

  devices.keyboard.onActivity.addListener(() => {
    if (activeScheme !== "keyboard") {
      console.log("Switching to keyboard")
      activeScheme = "keyboard"
    }
  })

  devices.gamepad.onActivity.addListener(() => {
    if (activeScheme !== "gamepad") {
      console.log("Switching to gamepad")
      activeScheme = "gamepad"
    }
  })

  const update = () => {
    devices.gamepad.update()

    switch (activeScheme) {
      case "keyboard":
        controls.move = devices.keyboard.getVector(
          "KeyD",
          "KeyA",
          "KeyW",
          "KeyS"
        )
        controls.aim = devices.keyboard.getVector(
          "ArrowRight",
          "ArrowLeft",
          "ArrowUp",
          "ArrowDown"
        )
        controls.fire = devices.keyboard.getKey("Space")
        break

      case "gamepad":
        controls.move = devices.gamepad.getVector(0, 1)!
        controls.aim = devices.gamepad.getVector(2, 3)!
        controls.fire = devices.gamepad.getButton(7)!
        break
    }
  }

  const dispose = () => {}

  return { controls, update, dispose }
}

export const controller = createSpaceRageController()
