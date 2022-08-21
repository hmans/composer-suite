import { Mul, pipe, Pow } from "shader-composer"
import { Translate } from "./Translate"
import { AccelerationProps } from "./Velocity"

export const Acceleration = ({ force, time }: AccelerationProps) =>
  Translate({
    offset: pipe(
      force,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  })
