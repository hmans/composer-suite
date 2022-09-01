import {
  BooleanControl,
  Controller,
  GamepadDevice,
  KeyboardDevice,
  processors,
  TouchDevice,
  VectorControl
} from "@hmans/controlfreak"

export const controller = new Controller()

const keyboard = new KeyboardDevice()
const gamepad = new GamepadDevice()
const touch = new TouchDevice()

controller.addDevice(keyboard)
controller.addDevice(gamepad)
controller.addDevice(touch)

controller
  .addControl("move", VectorControl)
  .addStep(
    keyboard.compositeVector(
      ["KeyW", "ArrowUp"],
      ["KeyS", "ArrowDown"],
      ["KeyA", "ArrowLeft"],
      ["KeyD", "ArrowRight"]
    )
  )
  .addStep(gamepad.axisVector(0, 1))
  .addStep(processors.clampVector(1))
  .addStep(processors.deadzone(0.15))

controller
  .addControl("fire", BooleanControl)
  .addStep(keyboard.whenKeyPressed(["Space", "Enter"]))
  .addStep(gamepad.whenButtonPressed(0))

controller.onDeviceChange.add((d) => console.log("new device:", d))
