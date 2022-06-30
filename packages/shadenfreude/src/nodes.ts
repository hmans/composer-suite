import { float, ShaderNode, Value } from "./shadenfreude"

export const FloatNode = (props?: { a?: Value<"float"> }) =>
  ShaderNode(
    {
      name: "Float Value",
      in: {
        a: float()
      },
      out: {
        value: float("in_a")
      }
    },
    props
  )

export const TimeNode = () =>
  ShaderNode({
    name: "Time",

    out: {
      /** The absolute time, in seconds */
      value: float("u_time"),

      /** Sine of the times */
      sin: float("sin(u_time)"),

      /** Cosine of the times */
      cos: float("cos(u_time)")
    },

    vertex: {
      header: "uniform float u_time;"
    },

    fragment: {
      header: "uniform float u_time;"
    }
  })
