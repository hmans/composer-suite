import { $, Expression } from "../expressions"
import { type } from "../glslType"
import { GLSLType, Input, isUnit, Unit, UnitConfig } from "../units"

/* See: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL) */

/**
 * The `CastableInput<T>` type describes the inputs that can be cast to a
 * `Unit<T>`. This type is used by the `Vec2`, `Vec3`, `Float` etc. unit
 * constructors, who will automatically cast the given values to the correct
 * type.
 */
export type CastableInput = any
/* NOTE: this will currently always allow any GLSL input. We may narrow it over time. */

export type CastFunction = (...values: CastableInput[]) => Expression

/**
 * Returns an expression that casts the given values to a `float`.
 */
export const float = (value: CastableInput) => $`float(${value})`

/**
 * Returns an expression that casts the given values to a `vec2`.
 */
export const vec2 = (value: CastableInput) => $`vec2(${value})`

/**
 * Returns an expression that casts the given values to a `vec3`.
 */
export const vec3 = (value: CastableInput) => $`vec3(${value})`

/**
 * Returns an expression that casts the given values to a `vec4`.
 */
export const vec4 = (value: CastableInput) => $`vec4(${value})`

/**
 * Returns an expression that casts the given values to a `mat2`.
 */
export const mat2 = (value: CastableInput) => $`mat2(${value})`

/**
 * Returns an expression that casts the given values to a `mat3`.
 */
export const mat3 = (value: CastableInput) => $`mat3(${value})`

/**
 * Returns an expression that casts the given values to a `mat4`.
 */
export const mat4 = (value: CastableInput) => $`mat4(${value})`

/**
 * Returns an expression that swizzles the given value with the provided
 * swizzling components.
 *
 * @param v The input value to swizzle.
 * @param swizzle The swizzling components to use.
 * @returns An expression that swizzles the given value with the provided swizzle string.
 */
export const swizzle = (v: Input<any>, swizzle: string) => $`${v}.${swizzle}`

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
  <T extends GLSLType>(type: T, castFunction: CastFunction) =>
  (v: CastableInput, extras?: Partial<UnitConfig<T>>) =>
    Unit(type, castFunction(v), extras) as Unit<T>

export const Float = makeCastableUnitFactory("float", float)
export const Int = makeUnitFactory("int")
export const Bool = makeUnitFactory("bool")
export const Vec2 = makeCastableUnitFactory("vec2", vec2)
export const Vec3 = makeCastableUnitFactory("vec3", vec3)
export const Vec4 = makeCastableUnitFactory("vec4", vec4)
export const Mat2 = makeCastableUnitFactory("mat2", mat2)
export const Mat3 = makeCastableUnitFactory("mat3", mat3)
export const Mat4 = makeCastableUnitFactory("mat4", mat4)

export const Root = (extras?: Partial<UnitConfig<"bool">>) => Bool(true, extras)
