import { GLSLType, ShaderNode, Variable } from "./types"
import { float, variablesToNodes } from "./variables"

export type ShaderNodeTemplate<T extends GLSLType> = Partial<ShaderNode<T>>

export function node<T extends GLSLType>(template: ShaderNodeTemplate<T>) {
  /* Create node from template */
  const node: ShaderNode<T> = {
    _shaderNode: true,
    name: "Unnamed",
    uniforms: {},
    varyings: {},
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

export function plug(source: Variable) {
  return {
    into: (target: Variable) => {
      target.value = source
    }
  }
}
