import { $ } from "../expressions"
import { type } from "../glslType"
import { GLSLType, Input, isUnit, Unit, UnitConfig } from "../units"

/* See: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL) */

export type CastableInput<T extends GLSLType> = T extends "float"
  ? Input<"int" | "float">
  : T extends "vec2"
  ? Input<"float" | "int" | "vec2">
  : T extends "vec3"
  ? Input<"float" | "int" | "vec2" | "vec3">
  : T extends "vec4"
  ? Input<"float" | "int" | "vec2" | "vec3" | "vec4">
  : Input<T>

const createCastFunction =
  <T extends GLSLType>(type: T) =>
  (...values: CastableInput<T>[]) =>
    $`${type}(${values.map((v) => $`${v}`).join(", ")})`

export const float = createCastFunction("float")
export const vec2 = createCastFunction("vec2")
export const vec3 = createCastFunction("vec3")
export const vec4 = createCastFunction("vec4")

// /** Cast the given value to a mat3. */
// export const mat3 = (i: Input<"mat3" | "mat4">) => Mat3($`mat3(${i})`)

// /** Cast the given value to a mat4. */
// export const mat4 = (i: Input<"mat3" | "mat4">) => Mat4($`mat4(${i})`)

export const unit = <T extends GLSLType>(
  i: Input<T>,
  config?: Partial<UnitConfig<T>>
) => (isUnit(i) ? i : Unit(type(i), i, config))

/**
 * Wraps an input value into a unit that is configured to use a varying.
 *
 * @param i Input value (unit, JS value or expression) to wrap in a varying unit.
 * @param config Optional extra configuration for the newly created unit.
 * @returns A new unit that wraps the given value and is configured to use a varying.
 */
export const varying = <T extends GLSLType>(
  i: Input<T>,
  config?: Partial<UnitConfig<T>>
) => Unit(type(i), i, { ...config, varying: true })
