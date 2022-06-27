import { nodeFactory, node, float } from "../../factories"

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
