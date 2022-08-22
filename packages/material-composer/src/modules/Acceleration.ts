import { Input, Mul, pipe, Pow } from "shader-composer"
import { ModuleFactory } from "."
import { Translate } from "./Translate"

export type AccelerationProps = {
  force: Input<"vec3">
  time: Input<"float">
}

export const Acceleration: ModuleFactory<AccelerationProps> = ({
  force,
  time
}) =>
  Translate({
    offset: pipe(
      force,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  })
