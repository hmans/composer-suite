import { block, concatenate, Parts, statement } from "./lib/concatenator3000"
import { isVariable, Value, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginHeader = (v: Variable) => `/*** BEGIN: ${v.name} ***/`
const variableEndHeader = (v: Variable) => `/*** END: ${v.name} ***/\n`

export const glslRepresentation = (value: Value): string => {
  /* If the value is itself a variable, reference it by name. */
  if (isVariable(value)) {
    return value.name
  }

  if (typeof value === "number") {
    return value.toFixed(5) // FIXME: use better precision
  }

  throw new Error(`Could not render value to GLSL: ${value}`)
}

export const compileHeader = (v: Variable, program: ProgramType): Parts => [
  /* Render dependencies */
  isVariable(v.value) && compileHeader(v.value, program),

  variableBeginHeader(v),
  v[program]?.header,
  variableEndHeader(v)
]

export const compileBody = (v: Variable, program: ProgramType): Parts => [
  /* Render dependencies */
  isVariable(v.value) && compileBody(v.value, program),

  variableBeginHeader(v),

  /* Declare the variable */
  statement(v.type, v.name, "=", glslRepresentation(v.value)),

  block(
    /* The body chunk, if there is one */
    v[program]?.body
  ),

  variableEndHeader(v)
]

export const compileProgram = (v: Variable, program: ProgramType) =>
  concatenate(
    compileHeader(v, program),
    "void main()",
    block(compileBody(v, program))
  )

export const compileShader = (root: Variable) => {
  const vertexShader = compileProgram(root, "vertex")
  const fragmentShader = compileProgram(root, "fragment")

  return { vertexShader, fragmentShader }
}
