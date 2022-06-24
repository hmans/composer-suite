import { GLSLType, ShaderNode, Variable } from "./types"

export const variablesToNodes = new Map<Variable, ShaderNode>()

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
    uniforms: {},
    inputs: {},
    outputs: {},
    vertex: { header: "", body: "" },
    fragment: { header: "", body: "" },
    ...template
  }

  /* Register outputs */
  for (const [_, variable] of Object.entries(node.outputs)) {
    variablesToNodes.set(variable, node)
  }

  return node
}
