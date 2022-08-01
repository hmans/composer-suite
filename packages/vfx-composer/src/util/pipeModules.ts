import { pipe } from "shader-composer"
import { ModuleState, Module } from "../modules"

export const pipeModules = (initial: ModuleState, ...modules: Module[]) =>
  pipe(initial, ...(modules as [Module]))
