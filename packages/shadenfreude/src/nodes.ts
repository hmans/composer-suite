import { float, ShaderNode, Value, VariableValues } from "./shadenfreude"

const Factory = <
  F extends (...args: any[]) => ShaderNode,
  S extends ShaderNode = ReturnType<F>,
  P = VariableValues<S["in"]>
>(
  fac: F
) => (props: P = {} as P) => fac(props) as S

const FloatNode = Factory(() =>
  ShaderNode({
    name: "Float Value",
    in: {
      a: float()
    },
    out: {
      value: float("in_a")
    }
  })
)

const node = FloatNode({ a: 1, b: 2 })
console.log(node.out.value)

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
