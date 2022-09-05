import { $ } from "../expressions"
import { type } from "../glslType"
import { GLSLType, Input, isUnit, Unit, UnitConfig } from "../units"
import { Float, Mat3, Mat4, Vec2, Vec3, Vec4 } from "./values"

export const float = (v: Input<"int" | "float">) => $`float(${v})`

export const vec2 = (...values: Input<"float" | "int" | "vec2">[]) =>
  $`vec2(${values.map((v) => $`${v}`).join(", ")})`

export const vec3 = (...values: Input<"float" | "int" | "vec2" | "vec3">[]) =>
  $`vec3(${values.map((v) => $`${v}`).join(", ")})`

export const vec4 = (
  ...values: Input<"float" | "int" | "vec2" | "vec3" | "vec4">[]
) => $`vec4(${values.map((v) => $`${v}`).join(", ")})`

// export const float = (
//   v: Input<"float" | "bool" | "int"> = 0,
//   extras?: Partial<UnitConfig<"float">>
// ) => Float($`float(${v})`, extras)

// export const vec2 = (
//   x: Input<"float"> = 0,
//   y: Input<"float"> = 0,
//   extras?: Partial<UnitConfig<"vec2">>
// ) => Vec2($`vec2(${x}, ${y})`, extras)

// export const vec3 = (
//   x: Input<"float"> = 0,
//   y: Input<"float"> = 0,
//   z: Input<"float"> = 0,
//   extras?: Partial<UnitConfig<"vec3">>
// ) => Vec3($`vec3(${x}, ${y}, ${z})`, extras)

// export const vec4 = (
//   x: Input<"float"> = 0,
//   y: Input<"float"> = 0,
//   z: Input<"float"> = 0,
//   w: Input<"float"> = 0,
//   extras?: Partial<UnitConfig<"vec4">>
// ) => Vec4($`vec4(${x}, ${y}, ${z}, ${w})`, extras)

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
