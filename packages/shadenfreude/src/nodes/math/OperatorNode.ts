import { glslType, inferVariable, node } from "../.."
import { GLSLType, Operator, Value, Variable } from "../../types"

export type OperatorNodeProps<T extends GLSLType> = {
  operator: Operator
  a: Value<T>
  b: Value<any>
}

export const OperatorNode = <T extends GLSLType>({
  a,
  b,
  operator
}: OperatorNodeProps<T>) =>
  node({
    name: `Perform ${operator} on ${glslType(a)}`,
    inputs: {
      a: inferVariable(a),
      b: inferVariable(b)
    },
    outputs: {
      value: inferVariable(a) as Variable<T>
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })
