import { GLSLType, ShaderNode, Variable } from "./types"

export function variable<T>(type: GLSLType, value?: T): Variable<T> {
  return {
    _variable: true,
    name: `var_${Math.floor(Math.random() * 100000)}`,
    type,
    value
  }
}

export function node(template: Partial<ShaderNode>) {
  const node: ShaderNode = {
    name: "Unnamed",
    inputs: {},
    outputs: {},
    vertex: { header: "", body: "" },
    fragment: { header: "", body: "" },
    ...template
  }

  return node
}
