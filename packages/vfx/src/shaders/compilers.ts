import {
  Attribute,
  Shader,
  Uniform,
  VariableQualifier,
  Variables,
  Varying
} from "./types"

export const formatValue = (value: any) =>
  typeof value === "number" ? value.toFixed(5) : value

function compileVariable(
  qualifier: VariableQualifier,
  name: string,
  variable: Uniform | Attribute | Varying,
  initializeValue = true
) {
  const valueString =
    initializeValue && "value" in variable && variable.value !== undefined
      ? ` = ${formatValue(variable.value)}`
      : ""

  return `${qualifier} ${variable.type} ${name}${valueString};`
}

function compileVariables(
  qualifier: VariableQualifier,
  variables: Variables,
  initializeValue = true
) {
  return Object.entries(variables)
    .map(([name, variable]) =>
      compileVariable(qualifier, name, variable, initializeValue)
    )
    .join("\n")
}

function compileProgram(shader: Shader, what: "fragment" | "vertex") {
  return `
    ${compileVariables("uniform", shader.uniforms, false)}
    ${
      what === "vertex"
        ? compileVariables("attribute", shader.attributes, false)
        : ""
    }
    ${compileVariables("varying", shader.varyings)}
    ${shader[`${what}Header`]}

    void main() {
      ${shader[`${what}Main`]}
    }`
}

export function compileShader(shader: Shader) {
  return {
    uniforms: shader.uniforms,
    vertexShader: compileProgram(shader, "vertex"),
    fragmentShader: compileProgram(shader, "fragment"),
    update: shader.update!
  }
}
