import { Input, Mul } from "shader-composer"
import { Translate } from "./Translate"

type VelocityProps = {
  velocity: Input<"vec3">
  time: Input<"float">
}

export const Velocity = ({ velocity, time }: VelocityProps) =>
  Translate({ offset: Mul(velocity, time) })
export type AccelerationProps = {
  force: Input<"vec3">
  time: Input<"float">
}
