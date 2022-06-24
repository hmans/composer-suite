import { ShaderNode, Variable } from "./types"

type Program = "vertex" | "fragment"

function compileVariableValue(variable: Variable): string {
  if (variable.value._variable) {
    return compileVariableValue(variable.value)
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
  return `
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
  `
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
