import { ModuleFactory } from "material-composer"
import { Input, Mul } from "shader-composer"

type ScaleProps = {
  scale: Input<"float">
}

export const Scale: ModuleFactory<ScaleProps> = ({ scale = 1 }) => (state) => ({
  ...state,
  position: Mul(state.position, scale)
})
