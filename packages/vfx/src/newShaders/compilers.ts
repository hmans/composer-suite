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

function compileProgram(shader: Shader, header: string, main: string) {
  const { uniforms, varyings } = shader

  return `
    ${compileVariables("uniform", uniforms, false)}
    ${compileVariables("varying", varyings)}
    ${header}

    void main() {
      ${main}
    }`
}

export function compileShader<U extends Variables>(shader: Shader<U>) {
  return {
    uniforms: shader.uniforms as U,

    vertexShader: compileProgram(
      shader,
      shader.vertexHeader,
      shader.vertexMain
    ),

    fragmentShader: compileProgram(
      shader,
      shader.fragmentHeader,
      shader.fragmentMain
    ),

    update: shader.update!
  }
}
