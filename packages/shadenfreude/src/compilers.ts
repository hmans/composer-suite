import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
import {
  assignment,
  block,
  concatenate,
  identifier,
  Parts,
  sluggify,
  statement
} from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"
import { isVariable, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginHeader = (v: Variable) => `/*** BEGIN: ${v.title} ***/`
const variableEndHeader = (v: Variable) => `/*** END: ${v.title} ***/\n`

export const compileHeader = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.fresh(v)) return []

  if (v.only && v.only !== program) return []

  return [
    /* Render dependencies */
    dependencies(v).map((input) => compileHeader(input, program, stack)),

    v[`${program}Header`] && [
      variableBeginHeader(v),
      v[`${program}Header`],
      variableEndHeader(v)
    ]
  ]
}

export const compileBody = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.fresh(v)) return []

  if (v.only && v.only !== program) return []

  return [
    /* Render dependencies */
    dependencies(v).map((input) => compileBody(input, program, stack)),

    variableBeginHeader(v),

    /* Declare the variable */
    statement(v.type, v.name),

    block(
      /* Make inputs available as local variables */
      inputs(v).map(
        ([name, input]) =>
          (!isVariable(input) || !input.only || input.only === program) &&
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
}

export const compileProgram = (v: Variable, program: ProgramType) =>
  concatenate(
    compileHeader(v, program),
    "void main()",
    block(compileBody(v, program))
  )

const prepare = (v: Variable, stack = dependencyStack()) => {
  if (!stack.fresh(v)) return

  /* Prepare dependencies first */
  dependencies(v).forEach((d) => prepare(d, stack))

  /* Give this variable a better name */
  const id = stack.nextId()
  v.name = identifier(v.type, sluggify(v.title), id)
  v.title += ` (${id})`
}

export const compileShader = (root: Variable) => {
  prepare(root)

  const vertexShader = compileProgram(root, "vertex")
  const fragmentShader = compileProgram(root, "fragment")

  const uniforms = {
    u_time: { value: 0 }
  }

  const update = (dt: number) => {
    uniforms.u_time.value += dt
  }

  return { vertexShader, fragmentShader, uniforms, update }
}

const dependencyStack = () => {
  const seen = new Set<Variable>()
  const nextId = idGenerator()

  return {
    fresh: (v: Variable) => (seen.has(v) ? false : seen.add(v) && true),
    nextId
  }
}

const inputs = (v: Variable) => Object.entries(v.inputs)

const inputDependencies = (v: Variable) =>
  inputs(v)
    .filter(([_, i]) => isVariable(i))
    .map(([_, i]) => i)

const dependencies = (v: Variable) =>
  [isVariable(v.value) && v.value, ...inputDependencies(v)].filter((d) => !!d)
