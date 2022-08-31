import { Input, Float, $ } from "shader-composer"

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random (Float)" })
