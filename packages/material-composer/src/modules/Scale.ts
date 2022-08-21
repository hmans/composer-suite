import { Input, Mul } from "shader-composer"
import { ModuleFactory } from "./index"

type ScaleProps = {
  scale: Input<"float">
}

export const Scale: ModuleFactory<ScaleProps> = ({ scale = 1 }) => (state) => ({
  ...state,
  position: Mul(state.position, scale)
})
