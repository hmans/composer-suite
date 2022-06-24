import { variable, node } from "./factories"

export const timeNode = () => {
  const u_time = variable("float", 0)

  return node({
    name: "Time Uniform",

    uniforms: { u_time },

    outputs: {
      time: variable("float", u_time)
    },

    update: (_, dt) => {
      u_time.value! += dt
    }
  })
}
