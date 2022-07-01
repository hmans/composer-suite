import {
  Factory,
  float,
  getValueType,
  inferVariable,
  Parameter,
  ShaderNode,
  ValueType,
  Variable,
  vec2,
  vec3,
  vec4
} from "../shadenfreude"

export const ComposeNode = Factory(() => ({
  name: "Compose components",
  in: {
    x: float(),
    y: float(),
    z: float(),
    w: float()
  },
  out: {
    value: vec4("vec4(in_x, in_y, in_z, in_w)"),
    vec4: vec4("vec4(in_x, in_y, in_z, in_w)"),
    vec3: vec3("vec3(in_x, in_y, in_z)"),
    vec2: vec2("vec2(in_x, in_y)")
  }
}))

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
  a: Parameter<T>
  b: Parameter<any>
}

export const OperatorNode = <T extends ValueType>({
  a,
  b,
  operator
}: OperatorProps<T> & { operator: Operator }) =>
  ShaderNode({
    name: `Perform ${operator} on ${getValueType(a)}`,
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
