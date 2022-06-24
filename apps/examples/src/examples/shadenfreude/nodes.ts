import { variable, node, vec3, float } from "./factories"
import { Variable } from "./types"

export const timeNode = () => {
  const u_time = variable("float", 0)

  return node({
    name: "Time Uniform",
    uniforms: { u_time },
    outputs: { time: float(u_time) },

    update: (_, dt) => {
      u_time.value! += dt
    }
  })
}

export const vertexPositionNode = () =>
  node({
    name: "Vertex Position",
    outputs: { position: vec3() },
    vertex: {
      body: "position = csm_Position;"
    }
  })

export const masterNode = (inputs: {
  diffuseColor?: Variable
  position?: Variable
}) =>
  node({
    name: "Master Node",
    inputs: {
      diffuseColor: vec3(inputs.diffuseColor),
      position: vec3(inputs.position)
    },
    vertex: {
      body: "csm_Position = position;"
    },
    fragment: {
      body: "csm_DiffuseColor.rgb = diffuseColor;"
    }
  })
