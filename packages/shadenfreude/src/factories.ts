import { GLSLType, ShaderNode, Value, Variable } from "./types"

export const variablesToNodes = new Map<Variable, ShaderNode>()

export function variable<T extends GLSLType>(
  type: T,
  value?: Value<T>
): Variable<T> {
  return {
    _variable: true,
    name: `var_${Math.floor(Math.random() * 100000)}`,
    type,
    value
  }
}

export const float = (value?: Value<"float">) => variable("float", value)

export const vec3 = (value?: Value<"vec3">) => variable("vec3", value)

export const vec4 = (value?: Value<"vec4">) => variable("vec4", value)

export type ShaderNodeTemplate = Partial<ShaderNode>

export function node(template: ShaderNodeTemplate) {
  /* Create node from template */
  const node: ShaderNode = {
    name: "Unnamed",
    uniforms: {},
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

export function nodeFactory<P extends { [key: string]: any }>(
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
