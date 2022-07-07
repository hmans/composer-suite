import { Float, isType, Value, Variable, Vec2, Vec3, Vec4 } from "../variables"

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
    return Vec4("vec4(x, y, z, w)", {
      inputs: { x, y, z, w }
    }) as JoinReturnType<Args>
  }

  if (z !== undefined) {
    return Vec3("vec3(x, y, z)", { inputs: { x, y, z } }) as JoinReturnType<
      Args
    >
  }

  return Vec2("vec2(x, y)", { inputs: { x, y } }) as JoinReturnType<Args>
}

export const SplitVector2 = (vector: Value<"vec2">) => ({
  x: Float("vector.x", { inputs: { vector } }),
  y: Float("vector.y", { inputs: { vector } })
})

export const SplitVector3 = (vector: Value<"vec3">) => ({
  x: Float("vector.x", { inputs: { vector } }),
  y: Float("vector.y", { inputs: { vector } }),
  z: Float("vector.z", { inputs: { vector } })
})

export const SplitVector4 = (vector: Value<"vec4">) => ({
  x: Float("vector.x", { inputs: { vector } }),
  y: Float("vector.y", { inputs: { vector } }),
  z: Float("vector.z", { inputs: { vector } }),
  w: Float("vector.w", { inputs: { vector } })
})

type VectorTypes = "vec2" | "vec3" | "vec4"

type SplitVector<V extends Value<VectorTypes>> = V extends Value<"vec4">
  ? {
      x: Value<"float">
      y: Value<"float">
      z: Value<"float">
      w: Value<"float">
    }
  : V extends Value<"vec3">
  ? { x: Value<"float">; y: Value<"float">; z: Value<"float"> }
  : V extends Value<"vec2">
  ? { x: Value<"float">; y: Value<"float"> }
  : never

export const Split = <V extends Value<VectorTypes>>(vector: V) => {
  if (isType(vector, "vec2")) return SplitVector2(vector) as SplitVector<V>
  if (isType(vector, "vec3")) return SplitVector3(vector) as SplitVector<V>
  if (isType(vector, "vec4")) return SplitVector4(vector) as SplitVector<V>
  throw new Error("Could not split value: " + vector)
}
