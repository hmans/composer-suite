import { nodeFactory, variable, node, float, vec3 } from "../factories"
import { Value } from "../types"

export const TimeNode = nodeFactory(() => {
  const u_time = variable("float", 0)

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
  ...VaryingNode({ value: "position" }),
  name: "Vertex Position"
}))

export const VaryingNode = nodeFactory<{ value: string }>(({ value }) => ({
  varyings: { v: vec3() },
  outputs: { value: vec3() },
  vertex: { body: `value = v = ${value};` },
  fragment: { body: `value = v;` }
}))
