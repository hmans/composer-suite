import { variable, node } from "./factories"
import { Variable } from "./types"

export const timeNode = () => {
  const u_time = variable("float", 0)

  return node({
    name: "Time Uniform",
    uniforms: { u_time },
    outputs: { time: variable("float", u_time) },

    update: (_, dt) => {
      u_time.value! += dt
    }
  })
}

export const masterNode = (inputs: {
  diffuseColor?: Variable
  position?: Variable
}) =>
  node({
    name: "Master Node",
    inputs: {
      diffuseColor: variable("vec3", inputs.diffuseColor),
      position: variable("vec3", inputs.position)
    },
    vertex: {
      body: "csm_Position = position;"
    },
    fragment: {
      body: "csm_DiffuseColor.rgb = diffuseColor;"
    }
  })
