import { glslType, inferVariable, node } from "../.."
import { Operator, Value } from "../../types"

export type OperatorNodeProps = {
  operator: Operator
  a: Value
  b: Value
}

export const OperatorNode = ({ a, b, operator }: OperatorNodeProps) =>
  node({
    name: `Perform ${operator} on ${glslType(a)}`,
    inputs: {
      a: inferVariable(a),
      b: inferVariable(b)
    },
    outputs: {
      value: inferVariable(a)
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })
