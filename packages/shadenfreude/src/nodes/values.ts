import { Factory, float, ValueType, variable, vec3 } from "../shadenfreude"

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

export const JoinVector3Node = Factory(() => ({
  name: "Join Vector3",
  inputs: {
    x: float(1),
    y: float(1),
    z: float(1)
  },
  outputs: {
    value: vec3("vec3(inputs.x, inputs.y, inputs.z)")
  }
}))
