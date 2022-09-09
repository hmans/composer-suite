import { pipe } from "fp-ts/lib/function"
import {
  applyDeadzone,
  clampVector,
  InputManager,
  isVector,
  magnitude
} from "input-composer"

export const createStandardController = (input: InputManager) => {
  let scheme = "keyboard" as "keyboard" | "gamepad"

  const withScheme =
    <T extends any>(s: "keyboard" | "gamepad", fun: (t: T) => T) =>
    (v: T) => {
      const value = fun(v)

      if (scheme === s) {
        return value
      } else if (
        (typeof value === "number" && value > 0) ||
        (isVector(value) && magnitude(value) > 0)
      ) {
        console.log("Switching to scheme:", s)
        scheme = s
        return value
      } else {
        return v
      }
    }

  return () => {
    /* Grab the devices we'll be working with. */
    const gamepad = input.gamepad.gamepad(0)
    const keyboard = input.keyboard

    const jump = pipe(
      0,
      withScheme("keyboard", () => keyboard.key(" ")),
      withScheme("gamepad", () => gamepad?.button(0) ?? 0)
    )

    const move = pipe(
      { x: 0, y: 0 },
      withScheme("keyboard", () => ({
        x: keyboard.axis("a", "d"),
        y: keyboard.axis("s", "w")
      })),
      withScheme("gamepad", () => ({
        x: +(gamepad?.axis(0) ?? 0),
        y: -(gamepad?.axis(1) ?? 0)
      })),
      clampVector(),
      applyDeadzone(0.05)
    )

    return { jump, move }
  }
}
