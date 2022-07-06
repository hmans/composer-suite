import { block, concatenate } from "./lib/concatenator3000"
import { Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

export const compileHeader = (v: Variable, program: ProgramType) => {}

export const compileBody = (v: Variable, program: ProgramType) => {}

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
