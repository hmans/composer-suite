import { Input } from "shader-composer"
import { Color as ColorImpl, ColorRepresentation } from "three"
import { ModuleFactory } from ".."

export type ColorArgs = {
  color: Input<"vec3"> | ColorRepresentation
}

export const Color: ModuleFactory<ColorArgs> = ({ color }) => (state) => {
  /* Determine new color */
  const newColor =
    typeof color === "string" || typeof color === "number"
      ? new ColorImpl(color)
      : color

  return {
    ...state,
    color: newColor
  }
}
