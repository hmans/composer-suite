import { ShaderNode, Variable } from "./types"
import { variablesToNodes } from "./variables"

export type ShaderNodeTemplate = Partial<ShaderNode>

export function node(template: ShaderNodeTemplate) {
  /* Create node from template */
  const node: ShaderNode = {
    _shaderNode: true,
    name: "Unnamed",
    uniforms: {},
    varyings: {},
    inputs: {},
    outputs: {},
    vertex: { header: "", body: "" },
    fragment: { header: "", body: "" },
    ...template,

    get value() {
      return this.outputs.value
    }
  }

  /* Register outputs */
  for (const [_, variable] of Object.entries(node.outputs)) {
    variablesToNodes.set(variable, node)
  }

  return node
}

export function nodeFactory<P = {}>(
  factory: (inputs: P) => ShaderNodeTemplate
) {
  return (props: P = {} as P) => node(factory(props))
}

export function plug(source: Variable) {
  return {
    into: (target: Variable) => {
      target.value = source
    }
  }
}
