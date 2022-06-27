import { node, nodeFactory, inferVariable } from "../../factories"
import { glslType } from "../../helpers"
import { Operator, Value } from "../../types"

export const OperatorNode = nodeFactory<{
  operator: Operator
  a: Value
  b: Value
}>(({ a, b, operator }) =>
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
)
