import {
  inferVariable,
  ShaderNode,
  Value,
  ValueType,
  Variable
} from "../shadenfreude"

function makeFunctionNode(fun: string) {
  return function<T extends ValueType>({ a }: OperatorNodeProps<T>) {
    return ShaderNode({
      name: `${fun} Function`,
      in: { a: inferVariable(a) },
      out: {
        value: {
          ...inferVariable(a),
          value: `${fun}(in_a)`
        } as Variable<T>
      }
    })
  }
}

export const SinNode = makeFunctionNode("sin")
export const CosNode = makeFunctionNode("cos")

type Operator = "+" | "-" | "*" | "/"

type OperatorNodeProps<T extends ValueType> = {
  a: Value<T>
  b: Value<any>
}

function makeOperatorNode(operator: Operator) {
  return function<T extends ValueType>({ a, b }: OperatorNodeProps<T>) {
    return ShaderNode({
      name: `Operator: ${operator}`,
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
