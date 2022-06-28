import { compileVariableValue, nodeFactory, Value, vec3 } from "../.."

export const Vec3VaryingNode = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    varyings: { v: vec3() },
    outputs: { value: vec3() },
    vertex: { body: `value = v = ${compileVariableValue(value)};` },
    fragment: { body: `value = v;` }
  })
)
