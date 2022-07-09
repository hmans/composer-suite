import { expr } from "../expressions"
import { type } from "../glslType"
import { Float, Value, Variable, Vec2, Vec3, Vec4 } from "../variables"

export const JoinVector2 = (x: Float, y: Float) => Vec2(expr`vec2(${x}, ${y})`)

export const JoinVector3 = (x: Float, y: Float, z: Float) =>
  Vec3(expr`vec3(${x}, ${y}, ${z})`)

export const JoinVector4 = (x: Float, y: Float, z: Float, w: Float) =>
  Vec4(expr`vec4(${x}, ${y}, ${z}, ${w})`)

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
