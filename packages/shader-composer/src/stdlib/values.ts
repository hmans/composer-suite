import { $, Expression } from "../expressions"
import { type } from "../glslType"
import { GLSLType, Input, isUnit, Unit, UnitConfig } from "../units"

/* See: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL) */

/**
 * We're allowing any type to be castable. For now. (If you're casting something weird,
 * the shader compilation will crash. Let's go!)
 */
export type CastableInput<T extends GLSLType> = Input<GLSLType>

export type CastFunction<T extends GLSLType> = (
  ...values: CastableInput<T>[]
) => Expression

/**
 * Returns an expression that casts the given values to a `float`.
 */
export const $float = (...values: CastableInput<"float">[]) =>
  $`float(${values})`

/**
 * Returns an expression that casts the given values to a `vec2`.
 */
export const $vec2 = (...values: CastableInput<"vec2">[]) => $`vec2(${values})`

/**
 * Returns an expression that casts the given values to a `vec3`.
 */
export const $vec3 = (...values: CastableInput<"vec3">[]) => $`vec3(${values})`

/**
 * Returns an expression that casts the given values to a `vec4`.
 */
export const $vec4 = (...values: CastableInput<"vec4">[]) => $`vec4(${values})`

/**
 * Returns an expression that casts the given values to a `mat2`.
 */
export const $mat2 = (...values: CastableInput<"mat2">[]) => $`mat2(${values})`

/**
 * Returns an expression that casts the given values to a `mat3`.
 */
export const $mat3 = (...values: CastableInput<"mat3">[]) => $`mat3(${values})`

/**
 * Returns an expression that casts the given values to a `mat4`.
 */
export const $mat4 = (...values: CastableInput<"mat4">[]) => $`mat4(${values})`

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

const makeCastableUnitFactory =
  <T extends GLSLType>(type: T, castFunction: CastFunction<T>) =>
  (v: CastableInput<T> | CastableInput<T>[], extras?: Partial<UnitConfig<T>>) =>
    Unit(type, castFunction(...(Array.isArray(v) ? v : [v])), extras) as Unit<T>

export const Float = makeCastableUnitFactory("float", $float)
export const Int = makeUnitFactory("int")
export const Bool = makeUnitFactory("bool")
export const Vec2 = makeCastableUnitFactory("vec2", $vec2)
export const Vec3 = makeCastableUnitFactory("vec3", $vec3)
export const Vec4 = makeCastableUnitFactory("vec4", $vec4)
export const Mat3 = makeCastableUnitFactory("mat3", $mat3)
export const Mat4 = makeCastableUnitFactory("mat4", $mat4)

export const Master = (extras?: Partial<UnitConfig<"bool">>) =>
  Bool(true, extras)
