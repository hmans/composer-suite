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

const renderSnippet = (
  s: Snippet,
  stack: ReturnType<typeof dependencyStack>
): Parts => {
  if (!stack.freshSnippet(s)) return []
  return s.chunk
}

export const compileHeader = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.freshVariable(v)) return []

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
    snippetDependencies(v).map((snip) => renderSnippet(snip, stack)),

    /* Render header chunk */
    header.length && [variableBeginComment(v), header, variableEndComment(v)]
  ]
}

export const compileBody = (
  v: Variable,
  program: ProgramType,
  stack = dependencyStack()
): Parts => {
  if (!stack.freshVariable(v)) return []

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
  if (!stack.freshVariable(v)) return

  /* Prepare dependencies first */
  variableDependencies(v).forEach((d) => prepare(d, stack))

  /* Update the node's ID */
  v._config.id = stack.nextId()

  /* Give this variable a better name */
  v._config.name = identifier(v.type, sluggify(v._config.title), v._config.id)
}

export const compileShader = (root: Variable) => {
  prepare(root)

  const vertexShader = compileProgram(root, "vertex")

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
  const seenVariables = new Set<Variable>()
  const seenSnippets = new Set<Snippet>()

  const nextId = idGenerator()

  return {
    freshVariable: (v: Variable) =>
      seenVariables.has(v) ? false : seenVariables.add(v) && true,

    freshSnippet: (s: Snippet) =>
      seenSnippets.has(s) ? false : seenSnippets.add(s) && true,

    nextId
  }
}

const variableDependencies = (v: Variable) =>
  [isVariable(v.value) && v.value, ...v._config.dependencies].filter(isVariable)

const snippetDependencies = (v: Variable) =>
  v._config.dependencies.filter(isSnippet)
