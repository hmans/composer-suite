import { pipe } from "fp-ts/function"
import { Input, Mul, Pow } from "shader-composer"
import { ModuleFactory } from ".."
import { Space, Translate } from "./Translate"

export type AccelerationProps = {
  direction: Input<"vec3">
  time: Input<"float">
  space?: Space
}

export const Acceleration: ModuleFactory<AccelerationProps> = ({
  direction,
  time,
  space = "world"
}) =>
  Translate({
    space,
    offset: pipe(
      direction,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  })
