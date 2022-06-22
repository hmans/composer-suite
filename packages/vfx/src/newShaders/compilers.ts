import { formatValue } from "../shaders"
import { IVariable, Shader, VariableQualifier, Variables } from "./types"

export function compileVariable(
  qualifier: VariableQualifier,
  name: string,
  { type, value }: IVariable
) {
  const valueString = value !== undefined ? ` = ${formatValue(value)}` : ""
  return `${qualifier} ${type} ${name}${valueString};`
}

export function compileVariables(
  qualifier: VariableQualifier,
  variables: Variables
) {
  return Object.entries(variables)
    .map(([name, variable]) => compileVariable(qualifier, name, variable))
    .join("\n")
}

export function compileProgram(
  shader: Shader,
  program: "vertexShader" | "fragmentShader"
) {
  const {
    uniforms,
    varyings,
    [program]: { header, main }
  } = shader

  return `
    ${compileVariables("uniform", uniforms)}
    ${compileVariables("varying", varyings)}
    ${header}

    void main() {
      ${main}
    }`
}
