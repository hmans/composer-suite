import {
  glslType,
  inferVariable,
  IVariableWithOutValue,
  ShaderNode,
  Value,
  ValueType,
  Variable
} from "../shadenfreude"

function makeFunctionNode(fun: string) {
  return function<T extends ValueType>({ a }: OperatorProps<T>) {
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

type OperatorProps<T extends ValueType> = {
  a: Value<T> | IVariableWithOutValue<T>
  b: Value<any> | IVariableWithOutValue<any>
}

export const OperatorNode = <T extends ValueType>({
  a,
  b,
  operator
}: OperatorProps<T> & { operator: Operator }) =>
  ShaderNode({
    name: `Perform ${operator} on ${glslType(a)}`,
    in: {
      a: inferVariable(a),
      b: inferVariable(b)
    },
    out: {
      value: {
        ...inferVariable(a),
        value: `in_a ${operator} in_b`
      } as Variable<T>
    }
  })

export const AddNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "+", a, b })

export const SubtractNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "-", a, b })

export const DivideNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "/", a, b })

export const MultiplyNode = <T extends ValueType>({ a, b }: OperatorProps<T>) =>
  OperatorNode({ operator: "*", a, b })
