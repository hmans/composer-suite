import { Color, Vector3 } from "three"
import {
  assignment,
  block,
  concatenate,
  Parts,
  statement
} from "./lib/concatenator3000"
import { type, isVariable, Value, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginHeader = (v: Variable) => `/*** BEGIN: ${v.name} ***/`
const variableEndHeader = (v: Variable) => `/*** END: ${v.name} ***/\n`

export const glslRepresentation = (value: Value): string => {
  if (isVariable(value)) return value.name

  if (typeof value === "string") return value

  if (typeof value === "boolean") return value ? "true" : "false"

  if (typeof value === "number") return value.toFixed(5)

  if (value instanceof Color)
    return `vec3(${glslRepresentation(value.r)}, ${glslRepresentation(
      value.g
    )}, ${glslRepresentation(value.b)})`

  if (value instanceof Vector3)
    return `vec3(${glslRepresentation(value.x)}, ${glslRepresentation(
      value.y
    )}, ${glslRepresentation(value.z)})`

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${value}`)
}

export const compileHeader = (v: Variable, program: ProgramType): Parts => [
  /* Render dependencies */
  isVariable(v.value) && compileHeader(v.value, program),
  Object.entries(v.inputs).map(
    ([_, input]) => isVariable(input) && compileHeader(input, program)
  ),

  variableBeginHeader(v),
  v[`${program}Header`],
  variableEndHeader(v)
]

const inputs = (v: Variable) => Object.entries(v.inputs)

export const compileBody = (v: Variable, program: ProgramType): Parts => [
  /* Render dependencies */
  isVariable(v.value) && compileBody(v.value, program),
  inputs(v).map(
    ([_, input]) => isVariable(input) && compileBody(input, program)
  ),

  variableBeginHeader(v),

  /* Declare the variable */
  statement(v.type, v.name),

  block(
    /* Make inputs available as local variables */
    Object.entries(v.inputs).map(([name, input]) =>
      assignment(`${type(input)} ${name}`, glslRepresentation(input))
    ),

    /* Make local value variable available */
    statement(v.type, "value", "=", glslRepresentation(v.value)),

    /* The body chunk, if there is one */
    v[`${program}Body`],

    /* Assign local value variable back to global variable */
    assignment(v.name, "value")
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
