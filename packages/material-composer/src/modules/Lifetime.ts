import { $, Input, Vec3 } from "shader-composer"
import { ModuleFactory } from ".."

export const Lifetime: ModuleFactory<{ progress: Input<"float"> }> = ({
  progress
}) => (state) => ({
  ...state,
  color: Vec3(state.color, {
    fragment: {
      body: $`if (${progress} < 0.0 || ${progress} > 1.0) discard;`
    }
  })
})
