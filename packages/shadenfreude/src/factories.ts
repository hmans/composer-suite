import { Color, Vector3, Vector4 } from "three"
import { GLSLType, ShaderNode, Variable, Value } from "./types"

export const variablesToNodes = new Map<Variable, ShaderNode>()

export function variable<T>(type: GLSLType, value?: T): Variable<T> {
  return {
    _variable: true,
    name: `var_${Math.floor(Math.random() * 100000)}`,
    type,
    value
  }
}

export const float = (value?: Value<number>) => variable("float", value)

export const vec3 = (value?: Value<Vector3 | Color>) => variable("vec3", value)

export const vec4 = (value?: Value<Vector4>) => variable("vec4", value)

export function node(template: Partial<ShaderNode>) {
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

export function plug(source: Variable) {
  return {
    into: (target: Variable) => {
      target.value = source
    }
  }
}
