import { compileVariableValue } from "../../compilers"
import { nodeFactory, vec3 } from "../../factories"
import { Value } from "../../types"

export const Vec3VaryingNode = nodeFactory<{ value: Value<"vec3"> }>(
  ({ value }) => ({
    varyings: { v: vec3() },
    outputs: { value: vec3() },
    vertex: { body: `value = v = ${compileVariableValue(value)};` },
    fragment: { body: `value = v;` }
  })
)
