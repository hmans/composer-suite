import { Camera, Scene, WebGLRenderer } from "three"
import { Expression } from "./expressions"
import { glslRepresentation } from "./glslRepresentation"
import { isSnippet, renameSnippet, Snippet } from "./snippets"
import { collectFromTree, Item, walkTree } from "./tree"
import { isUnit, isUnitInProgram, Program, uniformName, Unit } from "./units"
import {
  assignment,
  block,
  concatenate,
  identifier,
  Part,
  sluggify,
  statement
} from "./util/concatenator3000"
import idGenerator from "./util/idGenerator"

const beginUnit = (unit: Unit) => `/*** UNIT: ${unit._unitConfig.name} ***/`

const endUnit = (unit: Unit) => `\n`

const compileItem = (
  item: Unit | Expression | Snippet,
  program: Program,
  state: CompilerState
) => {
  if (state.seen.has(item)) return
  state.seen.add(item)

  /* If the item is something we know, delegate to the corresponding function */
  if (isUnit(item)) compileUnit(item, program, state)
  else if (isSnippet(item)) compileSnippet(item, program, state)
}

const compileSnippet = (snippet: Snippet, program: Program, state: CompilerState) => {
  /* Add snippet to header */
  state.header.push(snippet.expression)
}

const compileUnit = (unit: Unit, program: Program, state: CompilerState) => {
  /* As a sanity check, check if the unit is even allowed to be compiled into
	the requested program. */
  if (!isUnitInProgram(unit, program)) {
    throw new Error(
      program === "vertex"
        ? `Encountered a unit "${unit._unitConfig.name}" that is only allowed in the fragment shader, but was encountered when compiling the vertex shader. Please check your unit connections.`
        : `Encountered a unit "${unit._unitConfig.name}" that is only allowed in the vertex shader, but was encountered when compiling the fragment shader. Consider wrapping the value, or the derived value you're interested in, in a Unit that has a varying.`
    )
  }

  /* HEADER */
  const header = new Array<Part>()

  /* Declare varying if this unit has varying mode */
  if (unit._unitConfig.varying) {
    header.push(`varying ${unit._unitConfig.type} v_${unit._unitConfig.variableName};`)
  }

  /* Declare uniform, if one is configured. */
  if (unit._unitConfig.uniform) {
    /* Declare uniforms in header */
    header.push(statement("uniform", unit._unitConfig.type, uniformName(unit)))
  }

  /* Add header if present */
  if (unit._unitConfig[program]?.header) {
    header.push(unit._unitConfig[program]?.header)
  }

  if (header.length) state.header.push(beginUnit(unit), ...header, endUnit(unit))

  /* BODY */

  const value =
    unit._unitConfig.varying && program === "fragment"
      ? `v_${unit._unitConfig.variableName}`
      : unit._unitConfig.uniform
      ? uniformName(unit)
      : glslRepresentation(unit._unitConfig.value, unit._unitConfig.type)

  state.body.push(beginUnit(unit))

  /*
	Declare the unit's global variable, and assign the specified value to it.
	*/
  if (!unit._unitConfig.uniform) {
    state.body.push(
      statement(unit._unitConfig.type, unit._unitConfig.variableName, "=", value)
    )
  }

  /*
	If a body chunk is given, we'll create a scoped block with a local variable called
	"value" that the chunk can modify before it is assigned back to the unit's global.
	*/
  if (unit._unitConfig[program]?.body)
    state.body.push(
      block(
        /* Declare local value variable */
        !unit._unitConfig.uniform &&
          statement(unit._unitConfig.type, "value", "=", unit._unitConfig.variableName),

        /* Include body chunk */
        unit._unitConfig[program]?.body,

        /* Re-assign local value variable to global variable */
        !unit._unitConfig.uniform && assignment(unit._unitConfig.variableName, "value")
      )
    )

  /*
	If we're in varying mode and vertex, write value to the varying, too.
	*/
  if (!unit._unitConfig.uniform && unit._unitConfig.varying && program === "vertex") {
    state.body.push(
      assignment(`v_${unit._unitConfig.variableName}`, unit._unitConfig.variableName)
    )
  }

  state.body.push(endUnit(unit))
}

const prepareItem = (
  item: Unit | Expression | Snippet,
  nextId: ReturnType<typeof idGenerator>
) => {
  /* Prepare this unit */
  if (isUnit(item)) {
    /* Assign a variable name */
    item._unitConfig.variableName = identifier(sluggify(item._unitConfig.name), nextId())
    return
  }

  /* Is it a snippet? */
  if (isSnippet(item)) {
    renameSnippet(item, `snippet_${nextId()}`)
    return
  }
}

const compileProgram = (unit: Unit, program: Program, state: CompilerState): string => {
  walkTree(unit, program, (item) => compileItem(item, program, state))

  return concatenate(
    `/*** PROGRAM: ${program.toUpperCase()} ***/\n`,
    "precision highp float;\n",

    state.header,

    "void main()",
    block(state.body)
  )
}

export const compileShader = (root: Unit) => {
  /* STEP 1: prepare all units and their dependencies! */
  const nextId = idGenerator()
  walkTree(root, "any", (item) => prepareItem(item, nextId))

  /*
	STEP 2: compile the fragment shader. We're going to compile it first because
	we need to identify units with varyings, because we will _always_ want to
	include them in the vertex shader.
	*/
  const fragmentState = CompilerState()
  const fragmentShader = compileProgram(root, "fragment", fragmentState)

  /*
	STEP 3: compile the vertex shader. But first, we'll manually squeeze in all
	units with varyings.
	*/
  const vertexState = CompilerState()

  /* Explicitly add all units with varyings. */
  fragmentState.seen.forEach((item) => {
    if (isUnit(item) && item._unitConfig.varying) {
      walkTree(item, "vertex", (item) => compileItem(item, "vertex", vertexState))
    }
  })

  /* Compile! */
  const vertexShader = compileProgram(root, "vertex", vertexState)

  /*
	STEP 4: Collect uniforms.
	*/
  const unitsWithUniforms = collectFromTree(
    root,
    "any",
    (item) => isUnit(item) && !!item._unitConfig.uniform
  )

  const uniforms = unitsWithUniforms.reduce((acc, unit) => {
    return { ...acc, [uniformName(unit)]: unit._unitConfig.uniform }
  }, {})

  /*
	STEP 5: Collect update callbacks.
	*/
  const unitsWithUpdates = collectFromTree(
    root,
    "any",
    (item) => isUnit(item) && !!item._unitConfig.update
  )

  /*
	STEP 6: Build per-frame update function.
	*/
  const update = (dt: number, camera: Camera, scene: Scene, gl: WebGLRenderer) => {
    for (const unit of unitsWithUpdates) {
      unit._unitConfig.update(dt, camera, scene, gl)
    }
  }

  /* Build a dispose function */
  const allUnits: Unit[] = collectFromTree(root, "any", isUnit)
  const dispose = () => allUnits.forEach((u) => u._unitConfig.dispose?.())

  /*
	DONE! Let's return everything and go on a lengthy vacation somewhere nice.
	*/
  const shader = {
    vertexShader,
    fragmentShader,
    uniforms
  }

  const meta = {
    update,
    dispose
  }

  return [shader, meta] as const
}

type CompilerState = ReturnType<typeof CompilerState>

const CompilerState = () => ({
  header: new Array<Part>(),
  body: new Array<Part>(),
  nextid: idGenerator(),
  seen: new Set<Item>()
})
