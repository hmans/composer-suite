import { type } from "../glslType"
import {
  Value,
  float,
  vec3,
  Variable,
  vec4,
  vec2,
  GLSLType,
  isType
} from "../variables"

export type Vector2Components = [Value<"float">, Value<"float">]
export type Vector3Components = [Value<"float">, Value<"float">, Value<"float">]
export type Vector4Components = [
  Value<"float">,
  Value<"float">,
  Value<"float">,
  Value<"float">
]

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
    return vec4("vec4(x, y, z, w)", {
      inputs: { x, y, z, w }
    }) as JoinReturnType<Args>
  }

  if (z !== undefined) {
    return vec3("vec3(x, y, z)", { inputs: { x, y, z } }) as JoinReturnType<
      Args
    >
  }

  return vec2("vec2(x, y)", { inputs: { x, y } }) as JoinReturnType<Args>
}

export const SplitVector2 = (vector: Value<"vec2">): SplitVector<"vec2"> => ({
  x: float("vector.x", { inputs: { vector } }),
  y: float("vector.y", { inputs: { vector } })
})

export const SplitVector3 = (vector: Value<"vec3">): SplitVector<"vec3"> => ({
  x: float("vector.x", { inputs: { vector } }),
  y: float("vector.y", { inputs: { vector } }),
  z: float("vector.z", { inputs: { vector } })
})

export const SplitVector4 = (vector: Value<"vec4">): SplitVector<"vec4"> => ({
  x: float("vector.x", { inputs: { vector } }),
  y: float("vector.y", { inputs: { vector } }),
  z: float("vector.z", { inputs: { vector } }),
  w: float("vector.w", { inputs: { vector } })
})

type VectorTypes = "vec2" | "vec3" | "vec4"

type SplitVector<T extends VectorTypes> = T extends "vec4"
  ? {
      x: Value<"float">
      y: Value<"float">
      z: Value<"float">
      w: Value<"float">
    }
  : T extends "vec3"
  ? { x: Value<"float">; y: Value<"float">; z: Value<"float"> }
  : T extends "vec2"
  ? { x: Value<"float">; y: Value<"float"> }
  : never

export const Split = <T extends "vec2" | "vec3" | "vec4">(vector: Value<T>) => {
  if (isType(vector, "vec4"))
    return SplitVector4(vector) as {
      x: Value<"float">
      y: Value<"float">
      z: Value<"float">
      w: Value<"float">
    }

  if (isType(vector, "vec3"))
    return SplitVector3(vector) as {
      x: Value<"float">
      y: Value<"float">
      z: Value<"float">
    }
  if (isType(vector, "vec2"))
    return SplitVector2(vector) as {
      x: Value<"float">
      y: Value<"float">
    }
  throw new Error("Could not split value: " + vector)
}
