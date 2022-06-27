import { RenderCallback } from "@react-three/fiber"
import { IUniform } from "three"
import { variablesToNodes } from "./factories"
import { formatValue } from "./formatters"
import { isVariable, ShaderNode, Variable } from "./types"

type Program = "vertex" | "fragment"

function compileVariableValue(variable: Variable): string {
  const { value } = variable
  return isVariable(value) ? value.name : formatValue(value)
}

export function compileVariable(variable: Variable) {
  const valueString =
    variable.qualifier !== "uniform" && variable.value !== undefined
      ? ` = ${compileVariableValue(variable)}`
      : ""

  return `${variable.qualifier ?? ""} ${variable.type} ${
    variable.name
  }${valueString};`
}

function nodeTitle(node: ShaderNode) {
  return `/** Node: ${node.name} **/`
}

function dependencies(node: ShaderNode, deps = new Array<ShaderNode>()) {
  for (const variable of Object.values(node.inputs)) {
    if (isVariable(variable.value)) {
      /* get dependency */
      const dependency = variablesToNodes.get(variable.value)!
      if (!dependency) throw new Error("Dependency not found")

      /* If we haven't seen this dependency yet, invoke the callback */
      if (!deps.includes(dependency)) {
        dependencies(dependency, deps)
      }
    }
  }

  deps.push(node)
  return deps
}

function compileHeader(node: ShaderNode, program: Program) {
  const header = (n: ShaderNode) => `
    ${nodeTitle(n)}

    ${Object.entries(n.uniforms)
      .map(([_, variable]) =>
        compileVariable({ ...variable, qualifier: "uniform" })
      )
      .join("\n")}

    ${n[program].header ?? ""}
  `

  return dependencies(node)
    .map(header)
    .join("\n\n\n")
}

function compileBody(node: ShaderNode, program: Program) {
  return dependencies(node)
    .map(
      (node) => `
        ${nodeTitle(node)}

        ${Object.entries(node.outputs)
          .map(([_, variable]) => compileVariable(variable))
          .join("")}

        {
          /* Inputs */
          ${Object.entries(node.inputs)
            .map(([name, variable]) => compileVariable({ ...variable, name }))
            .join("")}

          /* Outputs */
          ${Object.entries(node.outputs)
            .map(([name, variable]) => compileVariable({ ...variable, name }))
            .join("")}

          /* Code */
          ${node[program].body ?? ""}

          /* Update globals */
          ${Object.entries(node.outputs)
            .map(([name, variable]) => `${variable.name} = ${name};`)
            .join("\n")}
        }
      `
    )
    .join("\n\n\n")
}

export function compileShader(root: ShaderNode) {
  /* Build uniforms */
  const uniforms = {} as Record<string, IUniform>

  dependencies(root).forEach((node) => {
    Object.entries(node.uniforms).forEach(([name, variable]) => {
      uniforms[variable.name] = variable as IUniform
    })
  })

  /* Build callbacks */
  const callbacks = dependencies(root).map((node) => node.update)

  const update: RenderCallback = (...args) => {
    callbacks.forEach((callback) => callback?.(...args))
  }

  /* Build vertex shader program */
  const vertexShader = `
    /*** VERTEX SHADER ***/

    ${compileHeader(root, "vertex")}

    void main() {
      ${compileBody(root, "vertex")}
    }`

  /* Build fragment shader program */
  const fragmentShader = `
    /*** FRAGMENT SHADER ***/

    ${compileHeader(root, "fragment")}

    void main() {
      ${compileBody(root, "fragment")}
    }`

  return {
    vertexShader,
    fragmentShader,
    uniforms,
    update
  }
}
