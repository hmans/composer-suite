import { $, Expression } from "../expressions"
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
  : T extends "mat2" | "mat3" | "mat4"
  ? Input<"float" | "int" | "vec2" | "vec3" | "vec4">
  : Input<T>

export type CastFunction<T extends GLSLType> = (
  ...values: CastableInput<T>[]
) => Expression

/**
 * Returns an expression that casts the given values to a `float`.
 */
export const float = (...values: CastableInput<"float">[]) =>
  $`float(${values})`

/**
 * Returns an expression that casts the given values to a `vec2`.
 */
export const vec2 = (...values: CastableInput<"vec2">[]) => $`vec2(${values})`

/**
 * Returns an expression that casts the given values to a `vec3`.
 */
export const vec3 = (...values: CastableInput<"vec3">[]) => $`vec3(${values})`

/**
 * Returns an expression that casts the given values to a `vec4`.
 */
export const vec4 = (...values: CastableInput<"vec4">[]) => $`vec4(${values})`

/**
 * Returns an expression that casts the given values to a `mat2`.
 */
export const mat2 = (...values: CastableInput<"mat2">[]) => $`mat2(${values})`

/**
 * Returns an expression that casts the given values to a `mat3`.
 */
export const mat3 = (...values: CastableInput<"mat3">[]) => $`mat3(${values})`

/**
 * Returns an expression that casts the given values to a `mat4`.
 */
export const mat4 = (...values: CastableInput<"mat4">[]) => $`mat4(${values})`

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

const makeUnitFactory =
  <T extends GLSLType>(type: T) =>
  (v: Input<T>, extras?: Partial<UnitConfig<T>>) =>
    Unit(type, v, extras) as Unit<T>

export const Float = makeUnitFactory("float")
export const Int = makeUnitFactory("int")
export const Bool = makeUnitFactory("bool")
export const Vec2 = makeUnitFactory("vec2")
export const Vec3 = makeUnitFactory("vec3")
export const Vec4 = makeUnitFactory("vec4")
export const Mat3 = makeUnitFactory("mat3")
export const Mat4 = makeUnitFactory("mat4")

export const Master = (extras?: Partial<UnitConfig<"bool">>) =>
  Bool(true, extras)

const makeNewUnitFactory =
  <T extends GLSLType>(type: T, castFunction: CastFunction<T>) =>
  (v: CastableInput<T> | CastableInput<T>[], extras?: Partial<UnitConfig<T>>) =>
    Unit(type, castFunction(...(Array.isArray(v) ? v : [v])), extras) as Unit<T>

export const NewFloat = (
  v: Input<"float">,
  config?: Partial<UnitConfig<"float">>
) => Unit("float", float(v), config)

export const NewVec3 = makeNewUnitFactory("vec3", vec3)

// export const Vec3 = makeNewUnitFactory("vec3", vec3)
// export const Vec2 = makeNewUnitFactory("vec2", vec2)
// export const Vec3 = (
//   value: CastableInput<"vec3"> | CastableInput<"vec3">[],
//   extras?: Partial<UnitConfig<"vec3">>
// ) => Unit("vec3", vec3(...Array(value).flat()), extras)
