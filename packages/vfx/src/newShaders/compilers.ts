import { IVariable, Shader, VariableQualifier, Variables } from "./types"

export const formatValue = (value: any) =>
  typeof value === "number" ? value.toFixed(5) : value

function compileVariable(
  qualifier: VariableQualifier,
  name: string,
  { type, value }: IVariable,
  initializeValue = true
) {
  const valueString =
    initializeValue && value !== undefined ? ` = ${formatValue(value)}` : ""
  return `${qualifier} ${type} ${name}${valueString};`
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

export function compileShader<U extends Variables>(shader: Shader<U>) {
  return {
    uniforms: shader.uniforms as U,
    vertexShader: compileProgram(shader, "vertex"),
    fragmentShader: compileProgram(shader, "fragment"),
    update: shader.update!
  }
}
