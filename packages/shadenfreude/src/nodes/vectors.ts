import { code } from "../expressions"
import { type } from "../glslType"
import { Float, Value, Node, Vec2, Vec3, Vec4 } from "../tree"

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

export const normalize = (a: Value) => code`normalize(${a})`

export const Normalize = <T extends "vec2" | "vec3" | "vec4">(a: Value<T>) =>
  Node(type(a) as T, normalize(a))

export const orthogonal = (v: Value<"vec3">) => code/*glsl*/ `
  normalize(
    abs(${v}.x) > abs(${v}.z)
    ? vec3( -${v}.y, ${v}.x, 0.0 )
    : vec3( 0.0, -${v}.z, ${v}.y)
  )`

export const Tangent = (v: Value<"vec3">) => Vec3(orthogonal(v))

export const Bitangent = (p: Value<"vec3">, t: Value<"vec3">) =>
  Normalize(Cross(p, t))

export const cross = (a: Value<"vec3">, b: Value<"vec3">) =>
  code`cross(${a}, ${b})`

export const Cross = (a: Value<"vec3">, b: Value<"vec3">) => Vec3(cross(a, b))
