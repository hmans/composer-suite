import { createModuleComponent } from "./reactor"

export * from "@material-composer/patch-material"
export * from "@material-composer/patched"
export * from "./composable"
export * from "./Layer"
export * from "./MaterialModules"
export {
  createModuleComponent as moduleComponent,
  ModuleReactor as modules
} from "./reactor"

import * as modules from "material-composer/modules"

export const Color = createModuleComponent(modules.Color)
