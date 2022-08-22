import { ModuleFactory } from "."
import { Input, Mul } from "shader-composer"

type RotateProps = {
  rotation: Input<"mat3">
}

export const Rotate: ModuleFactory<RotateProps> = ({ rotation }) => (
  state
) => ({
  ...state,
  position: Mul(state.position, rotation)
})
