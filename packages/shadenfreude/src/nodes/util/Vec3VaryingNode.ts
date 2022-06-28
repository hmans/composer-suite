import { compileVariableValue } from "../../compilers"
import { node } from "../../factories"
import { Value } from "../../types"
import { vec3 } from "../../variables"

export type Vec3VaryingNode = { value: Value<"vec3"> }

export const Vec3VaryingNode = (props: Vec3VaryingNode) =>
  node({
    varyings: { v: vec3() },
    outputs: { value: vec3() },
    vertex: { body: `value = v = ${compileVariableValue(props.value)};` },
    fragment: { body: `value = v;` }
  })
