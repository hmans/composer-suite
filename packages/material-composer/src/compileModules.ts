import { PatchedMaterialRoot } from "@material-composer/patch-material"
import { initialModuleState, Module, pipeModules } from "."

/**
 * Compiles a list of Material Composer modules into a shader graph that
 * can be consumed by Shader Composer's `composeShader` function.
 *
 * @param modules A list of Material Composer modules (see `Module`)
 * @returns A shader root node that can be passed to `compileShader`
 */
export const compileModules = (modules: Module[]) => {
  /* Transform state with given modules. */
  const state = pipeModules(initialModuleState(), ...modules)

  /* Construct a shader root unit */
  return PatchedMaterialRoot(state)
}
