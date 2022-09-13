import { ModuleFactory } from ".."
import { Input, Mat3, Mul } from "shader-composer"

type RotateProps = {
  rotation: Input<"mat3" | "mat4">
}

export const Rotate: ModuleFactory<RotateProps> = ({ rotation }) => (
  state
) => ({
  ...state,
  position: Mul(state.position, Mat3(rotation))
})
