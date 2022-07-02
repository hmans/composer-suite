import { Factory, ValueType, variable } from "../shadenfreude"

const ValueNode = <T extends ValueType>(type: T) => ({
  name: `Value (${type})`,
  in: { a: variable(type) },
  out: { value: variable(type, "in_a") }
})

export const BooleanNode = Factory(() => ValueNode("bool"))
export const FloatNode = Factory(() => ValueNode("float"))
export const Vector2Node = Factory(() => ValueNode("vec2"))
export const Vector3Node = Factory(() => ValueNode("vec3"))
export const ColorNode = Factory(() => ValueNode("vec3"))
export const Vector4Node = Factory(() => ValueNode("vec4"))
export const Matrix3Node = Factory(() => ValueNode("mat3"))
export const Matrix4Node = Factory(() => ValueNode("mat4"))
