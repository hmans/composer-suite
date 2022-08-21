import { $, Input, Vec3 } from "shader-composer"
import { ModuleFactory } from "./index"

export const Particles: ModuleFactory<{ Progress: Input<"float"> }> = ({
  Progress
}) => (state) => ({
  ...state,
  color: Vec3(state.color, {
    fragment: {
      body: $`if (${Progress} < 0.0 || ${Progress} > 1.0) discard;`
    }
  })
})
