import { code } from "../expressions"
import { type } from "../glslType"
import { Float, Value, Variable, Vec2, Vec3, Vec4 } from "../variables"

export const JoinVector2 = (x: Value<"float">, y: Value<"float">) =>
  Vec2(code`vec2(${x}, ${y})`)

export const JoinVector3 = (
  x: Value<"float">,
  y: Value<"float">,
  z: Value<"float">
) => Vec3(code`vec3(${x}, ${y}, ${z})`)

export const JoinVector4 = (
  x: Value<"float">,
  y: Value<"float">,
  z: Value<"float">,
  w: Value<"float">
) => Vec4(code`vec4(${x}, ${y}, ${z}, ${w})`)

export const SplitVector2 = (vector: Value<"vec2">) =>
  [Float(code`${vector}.x`), Float(code`${vector}.y`)] as const

export const SplitVector3 = (vector: Value<"vec3">) =>
  [
    Float(code`${vector}.x`),
    Float(code`${vector}.y`),
    Float(code`${vector}.z`)
  ] as const

export const SplitVector4 = (vector: Value<"vec4">) =>
  [
    Float(code`${vector}.x`),
    Float(code`${vector}.y`),
    Float(code`${vector}.z`),
    Float(code`${vector}.w`)
  ] as const

export const Normalize = <T extends "vec2" | "vec3" | "vec4">(x: Value<T>) =>
  Variable(type(x) as T, code`normalize(${x})`)
