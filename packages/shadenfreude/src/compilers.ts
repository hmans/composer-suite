import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
import {
  assignment,
  block,
  concatenate,
  flatten,
  identifier,
  Parts,
  sluggify,
  statement
} from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"
import { isVariable, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginComment = (v: Variable) =>
  `/*** BEGIN: ${v.title} (${v.id}) ***/`

const variableEndComment = (v: Variable) =>
  `/*** END: ${v.title} (${v.id}) ***/\n`

export const compileHeader = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.fresh(v)) return []

  if (v.only && v.only !== program) return []

  const header = flatten(
    v.varying && `varying ${v.type} v_${v.name};`,
    v[`${program}Header`]
  )

  return [
    /* Render dependencies */
    dependencies(v).map((input) => compileHeader(input, program, stack)),

    /* Render header chunk */
    header.length && [variableBeginComment(v), header, variableEndComment(v)]
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

    variableBeginComment(v),

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
      v.varying && program === "fragment"
        ? statement(v.type, "value", "=", `v_${v.name}`)
        : statement(v.type, "value", "=", glslRepresentation(v.value)),

      /* The body chunk, if there is one */
      v[`${program}Body`],

      /* Assign local value variable back to global variable */
      assignment(v.name, "value"),

      /* If we're in vertex and have a varying, assign to it, too */
      v.varying && program === "vertex" && assignment(`v_${v.name}`, "value")
    ),

    variableEndComment(v)
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

  /* Update the node's ID */
  v.id = stack.nextId()

  /* Give this variable a better name */
  v.name = identifier(v.type, sluggify(v.title), v.id)
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
