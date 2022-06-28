import { node } from "../../factories"
import { ShaderNode } from "../../types"
import { float } from "../../variables"
import { UniformNode } from "./UniformNode"

export type TimeNodeProps = { uniformName: string }

export const TimeNode = ({ uniformName = "u_time" }: TimeNodeProps) => {
  /* TODO: insert memoization here */
  const uniform: ShaderNode = UniformNode({
    name: uniformName,
    type: "float",
    initialValue: 0
  })

  uniform.update = (_, dt) => {
    ;(uniform.uniforms[uniformName].value as number) += dt
  }

  return node({
    name: "Time",
    inputs: {
      time: float(uniform)
    },
    outputs: {
      value: float("time"),
      sinTime: float("sin(time)"),
      cosTime: float("sin(time)")
    }
  })
}
