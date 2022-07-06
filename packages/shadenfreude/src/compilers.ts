import { Color, Vector3 } from "three"
import {
  assignment,
  block,
  concatenate,
  identifier,
  Parts,
  statement
} from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"
import { type, isVariable, Value, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginHeader = (v: Variable) => `/*** BEGIN: ${v.title} ***/`
const variableEndHeader = (v: Variable) => `/*** END: ${v.title} ***/\n`

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
  dependencies(v).map((input) => compileHeader(input, program)),

  variableBeginHeader(v),
  v[`${program}Header`],
  variableEndHeader(v)
]

export const compileBody = (v: Variable, program: ProgramType): Parts => [
  /* Render dependencies */
  dependencies(v).map((input) => compileBody(input, program)),

  variableBeginHeader(v),

  /* Declare the variable */
  statement(v.type, v.name),

  block(
    /* Make inputs available as local variables */
    inputs(v).map(([name, input]) =>
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
  prepare(root)

  const vertexShader = compileProgram(root, "vertex")
  const fragmentShader = compileProgram(root, "fragment")

  return { vertexShader, fragmentShader }
}

const prepare = (
  v: Variable,
  state = { nextId: idGenerator(), seen: new Set<Variable>() }
) => {
  if (state.seen.has(v)) return
  state.seen.add(v)

  /* Prepare dependencies first */
  dependencies(v).forEach((d) => prepare(d, state))

  /* Give this variable a better name */
  v.name = identifier(v.type, sluggify(v.title), state.nextId())
}

const inputs = (v: Variable) => Object.entries(v.inputs)

const inputDependencies = (v: Variable) =>
  inputs(v)
    .filter(([_, i]) => isVariable(i))
    .map(([_, i]) => i)

const dependencies = (v: Variable) =>
  [isVariable(v.value) && v.value, ...inputDependencies(v)].filter((d) => !!d)

const sluggify = (s: string) =>
  s.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
