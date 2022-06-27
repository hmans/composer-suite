import { nodeFactory, variable, node, float, vec3 } from "../factories"

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
  name: "Vertex Position",

  varyings: { v_position: vec3() },
  outputs: { value: vec3() },

  vertex: {
    body: `value = v_position = position;`
  },

  fragment: {
    body: `value = v_position;`
  }
}))
