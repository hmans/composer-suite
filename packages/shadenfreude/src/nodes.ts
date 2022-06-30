import { float, ShaderNode, Value } from "./shadenfreude"

export const FloatNode = (props?: { a?: Value<"float"> }) =>
  ShaderNode(
    {
      name: "Float Value",
      inputs: {
        a: float()
      },
      outputs: {
        value: float("a")
      }
    },
    props
  )

export const TimeNode = () =>
  ShaderNode({
    name: "Time",

    outputs: {
      value: float("u_time"),
      sin: float("sin(u_time)"),
      cos: float("cos(u_time)")
    },

    vertex: {
      header: "uniform float u_time;"
    },

    fragment: {
      header: "uniform float u_time;"
    }
  })
