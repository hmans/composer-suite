import { Vector2 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import {
  assignment,
  block,
  concatenate,
  flatten,
  identifier,
  isSnippet,
  Parts,
  resetConcatenator3000,
  sluggify,
  Snippet,
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

  /* Abort if we're not supposed to render this in the current program. */
  if (v._config.only && v._config.only !== program) return []

  /* Compose the header */
  const header = flatten(
    /* If this variable is configured to use a varying, declare it */
    v._config.varying && `varying ${v.type} v_${v._config.name};`,

    /* Render the actual header chuink */
    v._config[`${program}Header`]
  )

  return [
    /* Render variable dependencies */
    variableDependencies(v).map((dep) => compileHeader(dep, program, stack)),

    /* Render snippet dependencies */
    snippetDependencies(v).map((snip) => snip),

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
    variableDependencies(v).map((dep) => compileBody(dep, program, stack)),

    variableBeginComment(v),

    /* Declare the variable */
    statement(v.type, v._config.name),

    block(
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
  variableDependencies(v).forEach((d) => prepare(d, stack))

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

const variableDependencies = (v: Variable) =>
  [isVariable(v.value) && v.value, ...v._config.dependencies].filter(isVariable)

const snippetDependencies = (v: Variable) =>
  v._config.dependencies.filter(isSnippet)
