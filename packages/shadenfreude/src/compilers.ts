import { Vector2 } from "three"
import { isExpression } from "./expressions"
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
  stack: ReturnType<typeof compilerState>
): Parts => {
  if (!stack.freshSnippet(s)) return []
  return s.chunk
}

const getDependencies = (...sources: any[]): Variable[] =>
  sources
    .map((s) => (isExpression(s) ? s.values : undefined))
    // .map((s) => (Array.isArray(s) ? getDependencies(...s) : undefined))
    .flat()
    .filter((d) => !!d)

export const compileVariable = (
  v: Variable,
  program: ProgramType,
  state = compilerState()
) => {
  if (!state.freshVariable(v)) return []
  if (v._config.only && v._config.only !== program) return []

  /* Build a list of dependencies */
  const dependencies = getDependencies(v.value, v._config.fragmentBody)

  /* Render dependencies */
  dependencies.forEach(
    (dep) => isVariable(dep) && compileVariable(dep, program, state)
  )

  /* HEADER */
  const header = flatten(
    /* If this variable is configured to use a varying, declare it */
    v._config.varying && `varying ${v.type} v_${v._config.name};`,

    /* Render the actual header chuink */
    v._config[`${program}Header`]
  )

  state.header.push(
    /* Render header chunk */
    header.length && [variableBeginComment(v), header, variableEndComment(v)]
  )

  /* BODY */

  state.body.push(
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
  )
}

/**  Compile a program from the variable */
export const compileProgram = (v: Variable, program: ProgramType) => {
  const state = compilerState()
  compileVariable(v, program, state)

  console.log(state)

  return concatenate(state.header, "void main()", block(state.body))
}

export const compileShader = (root: Variable) => {
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

const compilerState = () => {
  const seenVariables = new Set<Variable>()
  const seenSnippets = new Set<Snippet>()

  const header = [] as Parts
  const body = [] as Parts

  const nextId = idGenerator()

  return {
    freshVariable: (v: Variable) =>
      seenVariables.has(v) ? false : seenVariables.add(v) && true,

    freshSnippet: (s: Snippet) =>
      seenSnippets.has(s) ? false : seenSnippets.add(s) && true,

    header,
    body,
    nextId
  }
}
