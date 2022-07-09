import { Vector2 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
import {
  assignment,
  block,
  concatenate,
  flatten,
  identifier,
  Parts,
  resetConcatenator3000,
  sluggify,
  statement
} from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"
import { isVariable, Variable } from "./variables"

export type ProgramType = "vertex" | "fragment"

const variableBeginComment = (v: Variable) =>
  `/*** BEGIN: ${v._config.title} (${v._config.id}) ***/`

const variableEndComment = (v: Variable) =>
  `/*** END: ${v._config.title} (${v._config.id}) ***/\n`

export const compileHeader = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.fresh(v)) return []

  if (v._config.only && v._config.only !== program) return []

  const header = flatten(
    v._config.varying && `varying ${v.type} v_${v._config.name};`,
    v._config[`${program}Header`]
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

  if (v._config.only && v._config.only !== program) return []

  return [
    /* Render dependencies */
    dependencies(v).map((input) => compileBody(input, program, stack)),

    variableBeginComment(v),

    /* Declare the variable */
    statement(v.type, v._config.name),

    block(
      /* Make inputs available as local variables */
      inputs(v).map(
        ([name, input]) =>
          (!isVariable(input) ||
            !input._config.only ||
            input._config.only === program) &&
          assignment(`${type(input)} ${name}`, glslRepresentation(input))
      ),

      /* Make local value variable available */
      v._config.varying && program === "fragment"
        ? statement(v.type, "value", "=", `v_${v._config.name}`)
        : statement(v.type, "value", "=", glslRepresentation(v.value)),

      /* The body chunk, if there is one */
      v._config[`${program}Body`],

      /* Assign local value variable back to global variable */
      assignment(v._config.name, "value"),

      /* If we're in vertex and have a varying, assign to it, too */
      v._config.varying &&
        program === "vertex" &&
        assignment(`v_${v._config.name}`, "value")
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
  v._config.id = stack.nextId()

  /* Give this variable a better name */
  v._config.name = identifier(v.type, sluggify(v._config.title), v._config.id)
}

export const compileShader = (root: Variable) => {
  prepare(root)

  resetConcatenator3000()
  const vertexShader = compileProgram(root, "vertex")

  resetConcatenator3000()
  const fragmentShader = compileProgram(root, "fragment")

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new Vector2() }
  }

  const update = (dt: number) => {
    uniforms.u_time.value += dt
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
  }

  return [{ vertexShader, fragmentShader, uniforms }, update] as const
}

const dependencyStack = () => {
  const seen = new Set<Variable>()
  const nextId = idGenerator()

  return {
    fresh: (v: Variable) => (seen.has(v) ? false : seen.add(v) && true),
    nextId
  }
}

const inputs = (v: Variable) => Object.entries(v._config.inputs)

const inputDependencies = (v: Variable) =>
  inputs(v)
    .filter(([_, i]) => isVariable(i))
    .map(([_, i]) => i)

const dependencies = (v: Variable) =>
  [isVariable(v.value) && v.value, ...inputDependencies(v)].filter((d) => !!d)
