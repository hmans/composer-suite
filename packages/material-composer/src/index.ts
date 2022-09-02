import { pipe } from "fp-ts/function"
import {
  $,
  Float,
  Input,
  Vec3,
  VertexNormal,
  VertexPosition
} from "shader-composer"

/**
 * ModuleState describes the state going into a module (and returned by it.)
 * Modules are encouraged to change the values they're interested in, but can
 * also just pass through others without changing them.
 */
export type ModuleState = {
  position: Input<"vec3">
  normal: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
  roughness: Input<"float">
  metalness: Input<"float">
}

/**
 * A Module is a function that accepts a module state as its input and returns a new module state.
 */
export type Module = (state: ModuleState) => ModuleState

export type ModuleFactory<P extends ModuleFactoryProps = {}> = (
  props: P
) => Module

export type ModuleFactoryProps = Record<string, any>

/**
 * A Module Pipe is an array of Modules.
 */
export type ModulePipe = Module[]

export const pipeModules = (initial: ModuleState, ...modules: Module[]) =>
  pipe(initial, ...(modules as [Module]))

export const initialModuleState = (): ModuleState => ({
  position: Vec3(VertexPosition, { name: "Final Position" }),
  normal: Vec3(VertexNormal, { name: "Final Normal " }),
  color: Vec3($`patched_Color`, { name: "Final Color" }),
  alpha: Float($`patched_Alpha`, { name: "Final Alpha" }),
  roughness: Float($`patched_Roughness`, { name: "Final Roughness" }),
  metalness: Float($`patched_Metalness`, { name: "Final Metalness" })
})

export * from "@material-composer/patch-material"
export * from "./compileModules"
export * from "./Layer"
