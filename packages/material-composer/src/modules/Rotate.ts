import { ModuleFactory } from ".."
import { Input, Mat3, Mul } from "shader-composer"

type RotateProps = {
  rotation: Input<"mat3" | "mat4">
  normal?: boolean
}

export const Rotate: ModuleFactory<RotateProps> = ({ rotation, normal = true }) => (
  state
) => ({
  ...state,
  normal: normal ? Mul(state.normal, Mat3(rotation)) : state.normal,
  position: Mul(state.position, Mat3(rotation))
})
