import { glslType } from "./helpers"
import {
  GLSLType,
  isShaderNode,
  isVariable,
  Qualifier,
  ShaderNode,
  Value,
  Variable
} from "./types"
import { tableize } from "./util"

export const variablesToNodes = new Map<Variable, ShaderNode>()

export function variable<T extends GLSLType>(
  type: T,
  value?: Value<T>
): Variable<T> {
  /* By default, we'll give the variable a random name. */
  const name = `var_${type}_${Math.floor(Math.random() * 100000)}`

  return {
    _variable: true,
    name,
    type,
    value
  }
}

export const float = (value?: Value<"float">) => variable("float", value)

export const bool = (value?: Value<"bool">) => variable("bool", value)

export const vec2 = (value?: Value<"vec2">) => variable("vec2", value)

export const vec3 = (value?: Value<"vec3">) => variable("vec3", value)

export const vec4 = (value?: Value<"vec4">) => variable("vec4", value)

export const mat3 = (value?: Value<"mat3">) => variable("mat3", value)

export const mat4 = (value?: Value<"mat4">) => variable("mat4", value)

/**
 * Creates a new variable with the GLSL type inferred from the specified value.
 */
export function inferVariable(a: Value): Variable {
  if (isVariable(a)) {
    return variable(a.type, a)
  } else if (isShaderNode(a)) {
    return inferVariable(a.value)
  } else {
    return variable(glslType(a), a)
  }
}

function generateVariableName(
  prefix: string,
  type: GLSLType,
  localName: string,
  qualifier: Qualifier | "input" | "output"
) {
  const parts = [prefix, qualifier, type, localName]

  return parts.join("_").replace(/_{2,}/, "_")
}

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

  /* Give node-specific global names to uniforms, varyings, inputs, and outputs. */
  const tableizedNodeName = tableize(node.name)
  const prefix = `${tableizedNodeName}_${Math.floor(Math.random() * 10000000)}`

  Object.entries(node.inputs).forEach(([localName, variable]) => {
    variable.name = generateVariableName(
      prefix,
      variable.type,
      localName,
      "input"
    )
  })

  Object.entries(node.outputs).forEach(([localName, variable]) => {
    variable.name = generateVariableName(
      prefix,
      variable.type,
      localName,
      "output"
    )
  })

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
