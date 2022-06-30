import {
  Factory,
  float,
  inferVariable,
  ShaderNode,
  Value,
  ValueType,
  Variable
} from "../shadenfreude"

export const SinNode = Factory(() => ({
  name: "Sine",
  in: { value: float() },
  out: { value: float("sin(in_value)") }
}))

export const CosNode = Factory(() => ({
  name: "Cosine",
  in: { value: float() },
  out: { value: float("cos(in_value)") }
}))

type Operator = "+" | "-" | "*" | "/"

type OperatorNodeProps<T extends ValueType> = {
  a: Value<T>
  b: Value<any>
}

function makeOperatorNode(operator: Operator) {
  return function<T extends ValueType>({ a, b }: OperatorNodeProps<T>) {
    return ShaderNode({
      name: "Addition",
      in: { a: inferVariable(a), b: inferVariable(b) },
      out: {
        value: {
          ...inferVariable(a),
          value: `in_a ${operator} in_b`
        } as Variable<T>
      }
    })
  }
}

export const AddNode = makeOperatorNode("+")
export const SubtractNode = makeOperatorNode("-")
export const MultiplyNode = makeOperatorNode("*")
export const DivideNode = makeOperatorNode("/")
