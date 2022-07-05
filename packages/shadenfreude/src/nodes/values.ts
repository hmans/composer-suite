import {
  Factory,
  float,
  getValueType,
  Parameter,
  ShaderNode,
  ValueType,
  variable,
  vec2,
  vec3,
  vec4
} from "../shadenfreude"

const ValueNode = <T extends ValueType>(type: T) => ({
  name: `Value (${type})`,
  inputs: { a: variable(type) },
  outputs: { value: variable(type, "inputs.a") }
})

export const BooleanNode = Factory(() => ValueNode("bool"))
export const FloatNode = Factory(() => ValueNode("float"))
export const Vector2Node = Factory(() => ValueNode("vec2"))
export const Vector3Node = Factory(() => ValueNode("vec3"))
export const ColorNode = Factory(() => ValueNode("vec3"))
export const Vector4Node = Factory(() => ValueNode("vec4"))
export const Matrix3Node = Factory(() => ValueNode("mat3"))
export const Matrix4Node = Factory(() => ValueNode("mat4"))

export const JoinVector3Node = Factory(() =>
  ShaderNode({
    name: "Join Vector3",
    inputs: {
      x: float(1),
      y: float(1),
      z: float(1)
    },
    outputs: {
      value: vec3("vec3(inputs.x, inputs.y, inputs.z)")
    }
  })
)

export const SplitVector2Node = Factory(() =>
  ShaderNode({
    name: "Split Vector2",
    inputs: {
      a: vec2()
    },
    outputs: {
      value: vec2("inputs.a"),
      x: float("inputs.a.x"),
      y: float("inputs.a.y")
    }
  })
)

export const SplitVector3Node = Factory(() =>
  ShaderNode({
    name: "Split Vector3",
    inputs: {
      a: vec3()
    },
    outputs: {
      value: vec3("inputs.a"),
      x: float("inputs.a.x"),
      y: float("inputs.a.y"),
      z: float("inputs.a.z")
    }
  })
)

export const SplitVector4Node = Factory(() =>
  ShaderNode({
    name: "Split Vector4",
    inputs: {
      a: vec4()
    },
    outputs: {
      value: vec4("inputs.a"),
      x: float("inputs.a.x"),
      y: float("inputs.a.y"),
      z: float("inputs.a.z"),
      w: float("inputs.a.w")
    }
  })
)

export const split = (v: Parameter<"vec2" | "vec3" | "vec4">) => {
  switch (getValueType(v)) {
    case "vec2":
      return SplitVector2Node({ a: v as Parameter<"vec2"> })
    case "vec3":
      return SplitVector3Node({ a: v as Parameter<"vec3"> })
    case "vec4":
      return SplitVector4Node({ a: v as Parameter<"vec4"> })
  }
}
