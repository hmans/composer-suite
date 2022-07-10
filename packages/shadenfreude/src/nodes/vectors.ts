import { code } from "../expressions"
import { type } from "../glslType"
import { Float, Value, Variable, Vec2, Vec3, Vec4 } from "../variables"

export const JoinVector2 = (x: Float, y: Float) => Vec2(code`vec2(${x}, ${y})`)

export const JoinVector3 = (x: Float, y: Float, z: Float) =>
  Vec3(code`vec3(${x}, ${y}, ${z})`)

export const JoinVector4 = (x: Float, y: Float, z: Float, w: Float) =>
  Vec4(code`vec4(${x}, ${y}, ${z}, ${w})`)

export const SplitVector2 = (vector: Vec2) =>
  [Float(code`${vector}.x`), Float(code`${vector}.y`)] as const

export const SplitVector3 = (vector: Vec3) =>
  [
    Float(code`${vector}.x`),
    Float(code`${vector}.y`),
    Float(code`${vector}.z`)
  ] as const

export const SplitVector4 = (vector: Vec4) =>
  [
    Float(code`${vector}.x`),
    Float(code`${vector}.y`),
    Float(code`${vector}.z`),
    Float(code`${vector}.w`)
  ] as const

export const Normalize = <T extends "vec2" | "vec3" | "vec4">(x: Value<T>) =>
  Variable(type(x) as T, code`normalize(${x})`)
