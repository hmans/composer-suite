import { Value, float, vec3, Variable, vec4, vec2 } from "../variables"

export const SplitVector3 = (vector: Value<"vec3">) => ({
  x: float("vector.x", { inputs: { vector } }),
  y: float("vector.y", { inputs: { vector } }),
  z: float("vector.z", { inputs: { vector } })
})

export const JoinVector3 = (
  x: Value<"float">,
  y: Value<"float">,
  z: Value<"float">
) =>
  vec3("vec3(x, y, z)", {
    inputs: { x, y, z }
  })

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

export const join = <
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
