import { Input, Mul } from "shader-composer"
import { Space, Translate } from "./Translate"

type VelocityProps = {
  velocity: Input<"vec3">
  time: Input<"float">
  space?: Space
}

export const Velocity = ({ velocity, time, space = "world" }: VelocityProps) =>
  Translate({ offset: Mul(velocity, time), space })
