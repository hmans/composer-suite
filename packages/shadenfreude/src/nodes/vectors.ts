import { expr } from "../expressions"
import { type } from "../glslType"
import { Float, Value, Variable, Vec2, Vec3, Vec4 } from "../variables"

export type Vector2Components = [Float, Float]
export type Vector3Components = [Float, Float, Float]
export type Vector4Components = [Float, Float, Float, Float]

export type JoinReturnType<Args> = Args extends Vector4Components
  ? Variable<"vec4">
  : Args extends Vector3Components
  ? Variable<"vec3">
  : Args extends Vector2Components
  ? Variable<"vec2">
  : never

export const Join = <
  Args extends Vector2Components | Vector3Components | Vector4Components
>(
  ...args: Args
) => {
  const [x, y, z, w] = args

  if (w !== undefined) {
    return Vec4(expr`vec4(${x}, ${y}, ${z}, ${w})`) as JoinReturnType<Args>
  }

  if (z !== undefined) {
    return Vec3(expr`vec3(${x}, ${y}, ${z})`) as JoinReturnType<Args>
  }

  return Vec2(expr`vec2(${x}, ${y})`) as JoinReturnType<Args>
}

export const SplitVector2 = (vector: Vec2) =>
  [Float(expr`${vector}.x`), Float(expr`${vector}.y`)] as const

export const SplitVector3 = (vector: Vec3) =>
  [
    Float(expr`${vector}.x`),
    Float(expr`${vector}.y`),
    Float(expr`${vector}.z`)
  ] as const

export const SplitVector4 = (vector: Vec4) =>
  [
    Float(expr`${vector}.x`),
    Float(expr`${vector}.y`),
    Float(expr`${vector}.z`),
    Float(expr`${vector}.w`)
  ] as const

export const Normalize = <T extends "vec2" | "vec3" | "vec4">(x: Value<T>) =>
  Variable(type(x) as T, expr`normalize(${x})`)
