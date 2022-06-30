import { Color, Vector2, Vector3, Vector4, Matrix3, Matrix4 } from "three"
import {
  Factory,
  float,
  isVariable,
  isVariableWithOutValue,
  ShaderNode,
  Value,
  ValueToJSType,
  ValueType,
  Variable,
  variable
} from "../shadenfreude"
import { FloatNode, Vector3Node } from "./values"

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

const makeOperatorNode = (operator: Operator) => <T extends ValueType>({
  a,
  b
}: OperatorNodeProps<T>) =>
  ShaderNode({
    name: "Addition",
    in: { a: inferVariable(a), b: inferVariable(b) },
    out: {
      value: {
        ...inferVariable(a),
        value: `in_a ${operator} in_b`
      } as Variable<T>
    }
  })

export const AddNode = makeOperatorNode("+")
export const SubtractNode = makeOperatorNode("-")
export const MultiplyNode = makeOperatorNode("*")
export const DivideNode = makeOperatorNode("/")

// Tests
const a = FloatNode({ value: 1 })
const v = Vector3Node({ value: new Vector3(1, 2, 3) })
const b = FloatNode({ value: 2 })

const add = AddNode({ a: a.out.value, b: b.out.value })

const inferVariable = (a: Value): Variable => {
  return variable(glslType(a), a)
}

function glslType(value: Value): ValueType {
  if (isVariable(value)) {
    return value.type
  } else if (isVariableWithOutValue(value)) {
    return glslType(value.out.value)
  } else if (typeof value === "number") {
    return "float"
  } else if (typeof value === "boolean") {
    return "bool"
  } else if (value instanceof Color) {
    return "vec3"
  } else if (value instanceof Vector2) {
    return "vec2"
  } else if (value instanceof Vector3) {
    return "vec3"
  } else if (value instanceof Vector4) {
    return "vec4"
  } else if (value instanceof Matrix3) {
    return "mat3"
  } else if (value instanceof Matrix4) {
    return "mat4"
  } else {
    throw new Error(`Could not find a GLSL type for: ${value}`)
  }
}
