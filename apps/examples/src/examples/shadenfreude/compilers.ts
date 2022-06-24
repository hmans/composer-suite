import { RenderCallback } from "@react-three/fiber"
import { variablesToNodes } from "./factories"
import { ShaderNode, Variable } from "./types"

type Program = "vertex" | "fragment"

type CompileState = {
  renderedNodes: Set<ShaderNode>
}

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

export function formatValue(v: any) {
  return typeof v === "number" ? v.toFixed(5) : v
}

function nodeTitle(node: ShaderNode) {
  return `/** Node: ${node.name} **/`
}

function compileHeader(
  node: ShaderNode,
  program: Program,
  state: CompileState = { renderedNodes: new Set<ShaderNode>() }
): string {
  const parts = new Array<string>()

  /* Add dependents */
  for (const [name, variable] of Object.entries(node.inputs)) {
    if (variable.value._variable) {
      const dependency = variablesToNodes.get(variable.value)!
      if (!dependency) throw new Error("Dependency not found")

      if (!state.renderedNodes.has(dependency)) {
        parts.push(compileHeader(dependency, program, state))
      }
    }
  }

  parts.push(`
    ${nodeTitle(node)}
    ${node[program].header}
  `)

  state.renderedNodes.add(node)

  return parts.join("\n\n\n")
}

function compileBody(
  node: ShaderNode,
  program: Program,
  state: CompileState = { renderedNodes: new Set<ShaderNode>() }
): string {
  const parts = new Array<string>()

  /* Add dependents */
  for (const [name, variable] of Object.entries(node.inputs)) {
    if (variable.value._variable) {
      const dependency = variablesToNodes.get(variable.value)!
      if (!dependency) throw new Error("Dependency not found")

      if (!state.renderedNodes.has(dependency)) {
        parts.push(compileBody(dependency, program, state))
      }
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

  state.renderedNodes.add(node)

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

  const update: RenderCallback = (...args) => {
    console.log("hi")
  }

  return { vertexShader, fragmentShader, uniforms, update }
}
