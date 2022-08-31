import { Input, Mul, pipe, Pow } from "shader-composer"
import { ModuleFactory } from ".."
import { Space, Translate } from "./Translate"

export type AccelerationProps = {
  force: Input<"vec3">
  time: Input<"float">
  space?: Space
}

export const Acceleration: ModuleFactory<AccelerationProps> = ({
  force,
  time,
  space = "world"
}) =>
  Translate({
    space,
    offset: pipe(
      force,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  })
