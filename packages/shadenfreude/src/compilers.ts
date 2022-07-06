import { block, comment, concatenate } from "./lib/concatenator3000"
import { Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginHeader = (v: Variable) => `/*** BEGIN: ${v.name} ***/`
const variableEndHeader = (v: Variable) => `/*** END: ${v.name} ***/\n`

export const compileHeader = (v: Variable, program: ProgramType) => [
  variableBeginHeader(v),
  v[program]?.header,
  variableEndHeader(v)
]

export const compileBody = (v: Variable, program: ProgramType) => [
  variableBeginHeader(v),
  v[program]?.body,
  variableEndHeader(v)
]

export const compileProgram = (v: Variable, program: ProgramType) =>
  concatenate(
    compileHeader(v, program),
    "void main",
    block(compileBody(v, program))
  )

export const compileShader = (root: Variable) => {
  const vertexShader = compileProgram(root, "vertex")
  const fragmenShader = compileProgram(root, "fragment")

  return { vertexShader, fragmenShader }
}
