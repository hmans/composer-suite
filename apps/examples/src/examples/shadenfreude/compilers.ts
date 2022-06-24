import { variablesToNodes } from "./factories"
import { ShaderNode, Variable } from "./types"

type Program = "vertex" | "fragment"

function compileVariableValue(variable: Variable): string {
  if (variable.value._variable) {
    return variable.value.name
  } else {
    return formatValue(variable.value)
  }
}

function compileVariable(variable: Variable) {
  const valueString =
    variable.value !== undefined ? ` = ${compileVariableValue(variable)}` : ""

  return `
    ${variable.type} ${variable.name}${valueString};
  `
}

function formatValue(v: any) {
  return typeof v === "number" ? v.toFixed(5) : v
}

function nodeTitle(node: ShaderNode) {
  return `/** Node: ${node.name} **/`
}

function compileHeader(node: ShaderNode, program: Program): string {
  return `
    ${nodeTitle(node)}
    ${node[program].header}
  `
}

function compileBody(node: ShaderNode, program: Program): string {
  const parts = new Array<string>()

  /* Add dependents */
  for (const [name, variable] of Object.entries(node.inputs)) {
    if (variable.value._variable) {
      /* TODO: track which dependencies we've already rendered */
      const dependency = variablesToNodes.get(variable.value)!
      parts.push(compileBody(dependency, program))
    }
  }

  parts.push(`
    ${nodeTitle(node)}

    ${Object.entries(node.outputs)
      .map(([name, variable]) => compileVariable(variable))
      .join("\n")}

    {
      /* Inputs */
      ${Object.entries(node.inputs)
        .map(([name, variable]) => compileVariable({ ...variable, name }))
        .join("\n")}

      /* Code */
      ${node[program].body}
    }
  `)

  return parts.join("\n\n\n")
}

export function compileShader(root: ShaderNode) {
  const vertexShader = `
    /*** VERTEX SHADER ***/

    ${compileHeader(root, "vertex")}

    void main() {
      ${compileBody(root, "vertex")}
    }`

  const fragmentShader = `
    /*** FRAGMENT SHADER ***/

    ${compileHeader(root, "fragment")}

    void main() {
      ${compileBody(root, "fragment")}
    }`

  const uniforms = {}

  return { vertexShader, fragmentShader, uniforms }
}
