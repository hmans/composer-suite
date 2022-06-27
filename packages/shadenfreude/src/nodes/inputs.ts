import { compileVariableValue } from "../compilers"
import { nodeFactory, variable, node, float, vec3 } from "../factories"
import { Value } from "../types"

export const TimeNode = nodeFactory(() => {
  const u_time = float(0)

  return node({
    name: "Time Uniform",
    uniforms: { u_time },
    outputs: { value: float(u_time) },

    update: (_, dt) => {
      ;(u_time.value as number)! += dt
    }
  })
})

export const VertexPositionNode = nodeFactory(() => ({
  ...Vec3VaryingNode({ value: "position" }),
  name: "Vertex Position"
}))

export const Vec3VaryingNode = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    varyings: { v: vec3() },
    outputs: { value: vec3() },
    vertex: { body: `value = v = ${compileVariableValue(value)};` },
    fragment: { body: `value = v;` }
  })
)
