import { Input, Mul } from "shader-composer"
import { Space, Translate } from "./Translate"

type VelocityProps = {
  direction: Input<"vec3">
  time: Input<"float">
  space?: Space
}

export const Velocity = ({ direction, time, space = "world" }: VelocityProps) =>
  Translate({ offset: Mul(direction, time), space })
