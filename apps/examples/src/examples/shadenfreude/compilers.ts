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

function performWithDependencies(
  node: ShaderNode,
  callback: (dependency: ShaderNode) => void,
  state: CompileState = { renderedNodes: new Set<ShaderNode>() }
) {
  /* Perform for dependencies */
  for (const [_, variable] of Object.entries(node.inputs)) {
    if (variable.value._variable) {
      /* get dependency */
      const dependency = variablesToNodes.get(variable.value)!
      if (!dependency) throw new Error("Dependency not found")

      /* If we haven't seen this dependency yet, invoke the callback */
      if (!state.renderedNodes.has(dependency)) {
        performWithDependencies(dependency, callback, state)
      }
    }
  }

  /* Perform for this node */
  state.renderedNodes.add(node)
  callback(node)
}

function compileHeader(node: ShaderNode, program: Program) {
  const parts = new Array<string>()

  performWithDependencies(node, (node) => {
    parts.push(`
      ${nodeTitle(node)}
      ${node[program].header}
    `)
  })

  return parts.join("\n\n\n")
}

function compileBody(node: ShaderNode, program: Program) {
  const parts = new Array<string>()

  performWithDependencies(node, (node) => {
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

        /* Outputs */
        ${Object.entries(node.outputs)
          .map(([name, variable]) => compileVariable({ ...variable, name }))
          .join("\n")}

        /* Code */
        ${node[program].body}

        /* Update globals */
        ${Object.entries(node.outputs)
          .map(([name, variable]) => `${variable.name} = ${name};`)
          .join("\n")}
      }
    `)
  })

  return parts.join("\n\n\n")
}

function getUpdateCallback(node: ShaderNode): RenderCallback {
  const callbacks = new Array<RenderCallback>()

  performWithDependencies(node, (node) => {
    if (node.update) {
      callbacks.push(node.update)
    }
  })

  return (...args) => {
    callbacks.forEach((callback) => callback(...args))
  }
}

function getUniforms(node: ShaderNode) {
  const uniforms = {}

  performWithDependencies(node, (node) => {
    Object.assign(uniforms, node.uniforms)
  })

  return uniforms
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

  return {
    vertexShader,
    fragmentShader,
    uniforms: getUniforms(root),
    update: getUpdateCallback(root)
  }
}
