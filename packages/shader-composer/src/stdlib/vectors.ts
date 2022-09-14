import { $ } from "../expressions"
import { type } from "../glslType"
import { Input, Unit } from "../units"
import { Float, Vec3 } from "./values"

export const $orthogonal = (v: Input<"vec3">) => $/*glsl*/ `
  normalize(
    abs(${v}.x) > abs(${v}.z)
    ? vec3( -${v}.y, ${v}.x, 0.0 )
    : vec3( 0.0, -${v}.z, ${v}.y)
  )`

/**
 * Returns the normalized (unit length) version of a given vector.
 *
 * @param a The vec2/3/4 input value to normalize.
 * @returns A new Shader Unit containing the normalized value of `a`.
 */
export const Normalize = <T extends "vec2" | "vec3" | "vec4">(a: Input<T>) =>
  Unit(type(a) as T, $`normalize(${a})`, { name: "Normalize" })

export const Cross = (a: Input<"vec3">, b: Input<"vec3">) =>
  Vec3($`cross(${a}, ${b})`, { name: "Cross Product" })

export const Dot = <T extends "vec2" | "vec3" | "vec4">(
  a: Input<T>,
  b: Input<T>
) => Float($`dot(${a}, ${b})`, { name: "Dot Product" })

export const Tangent = (v: Input<"vec3">) =>
  Vec3($orthogonal(v), { name: "Tangent" })

export const Bitangent = (p: Input<"vec3">, t: Input<"vec3">) =>
  Vec3(Normalize(Cross(p, t)), { name: "Bitangent" })

export const Distance = <T extends "float" | "vec2" | "vec3" | "vec4">(
  a: Input<T>,
  b: Input<T>
) => Float($`distance(${a}, ${b})`, { name: "Distance" })

export const Length = <T extends "float" | "vec2" | "vec3" | "vec4">(
  a: Input<T>
) => Float($`length(${a})`, { name: "Length" })

export const Reflect = <T extends "float" | "vec2" | "vec3" | "vec4">(
  vector: Input<T>,
  normal: Input<T>
) =>
  Unit(type(vector), $`reflect(${vector}, ${normal})`, {
    name: `Reflect (${type(vector)})`
  })

export const Refract = <T extends "float" | "vec2" | "vec3" | "vec4">(
  vector: Input<T>,
  normal: Input<T>,
  eta: Input<"float">
) =>
  Unit(type(vector), $`refract(${vector}, ${normal}, ${eta})`, {
    name: `Refract (${type(vector)})`
  })
