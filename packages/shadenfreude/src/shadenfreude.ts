import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import {
  assignment,
  block,
  concatenate,
  identifier,
  Parts,
  statement
} from "./lib/concatenator3000"

/*

 __    _  _______  ______   _______  _______
|  |  | ||       ||      | |       ||       |
|   |_| ||   _   ||  _    ||    ___||  _____|
|       ||  | |  || | |   ||   |___ | |_____
|  _    ||  |_|  || |_|   ||    ___||_____  |
| | |   ||       ||       ||   |___  _____| |
|_|  |__||_______||______| |_______||_______|

*/

export type Chunk = string | string[]

export type Program = {
  header?: Chunk
  body?: Chunk
}

export type ProgramType = "vertex" | "fragment"

/** The IShaderNode interface describes the objects that configure individual shader nodes. */
export interface IShaderNode {
  /** Name of the shader node. Will be injected into the compiled GSLS for easier debugging. */
  name?: string

  /** The vertex shader program configuration. */
  vertex?: Program

  /** The fragment shader program configuration. */
  fragment?: Program

  /**
   * Shader nodes may declare uniforms. When declared as part of the `uniforms` property,
   * the compiler will automatically inject them into the shader headers.
   */
  uniforms?: Variables

  /**
   * Shader nodes may declare varyings. When declared as part of the `varyings` property,
   * the compiler will automatically inject them into the shader headers, but using
   * a scoped name. Within the context of this shader node, the varying can still be
   * accessed using the name provided here.
   */
  varyings?: Variables

  /**
   * Input variables.
   */
  inputs?: Variables

  /**
   * Output variables.
   */
  outputs?: Variables

  /**
   * Filters. Any node can be used as a filter that has default inputs and outputs of the same
   * type as this node's default output value.
   */
  filters?: IShaderNode[]
}

export interface IShaderNodeWithDefaultInput<T extends ValueType = any>
  extends IShaderNode {
  inputs: { a: Variable<T> }
}

export interface IShaderNodeWithDefaultOutput<T extends ValueType = any>
  extends IShaderNode {
  outputs: { value: Variable<T> }
}

/**
 * The shader node constructor. All shaders nodes must be constructed using this function.
 * It will accept an IShaderNode compatible definition as its first argument and process it,
 * most importantly linking its input and output variables to the node.
 *
 * @param node The shader node definition.
 * @param props An optional properties object whose values will be assigned to the node's inputs.
 * @returns The constructed shader node.
 */
export const ShaderNode = <
  S extends IShaderNode,
  P extends Partial<Parameters<S["inputs"]>>
>(
  node: S,
  props: P = {} as P
): S => {
  /* Assign a default name */
  node.name = node.name || "Unnamed Node"

  /* Assign variable owners */
  const variables = [
    ...Object.values(node.varyings || {}),
    ...Object.values(node.outputs || {}),
    ...Object.values(node.inputs || {})
  ]

  variables.forEach((variable) => {
    variable.node = node
  })

  /* Assign props to input variables */
  Object.entries(props).forEach(([name, prop]) => {
    const variable = node.inputs?.[name]
    if (!variable) return

    if (isShaderNodeWithDefaultOutput(prop)) {
      variable.value = prop.outputs.value
    } else {
      variable.value = prop
    }
  })

  return node
}

export const Factory = <
  F extends () => IShaderNode = () => IShaderNode,
  S extends IShaderNode = ReturnType<F>,
  Props = Partial<Parameters<S["inputs"]>>
>(
  fac: F
) => (props: Props = {} as Props) => ShaderNode(fac(), props) as S

/*

 __   __  _______  ______    ___   _______  _______  ___      _______  _______
|  | |  ||   _   ||    _ |  |   | |   _   ||  _    ||   |    |       ||       |
|  |_|  ||  |_|  ||   | ||  |   | |  |_|  || |_|   ||   |    |    ___||  _____|
|       ||       ||   |_||_ |   | |       ||       ||   |    |   |___ | |_____
|       ||       ||    __  ||   | |       ||  _   | |   |___ |    ___||_____  |
 |     | |   _   ||   |  | ||   | |   _   || |_|   ||       ||   |___  _____| |
  |___|  |__| |__||___|  |_||___| |__| |__||_______||_______||_______||_______|

*/

export type ValueType =
  | "string"
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"

export type ValueToJSType = {
  string: string
  bool: boolean
  float: number
  vec2: Vector2
  vec3: Vector3 | Color
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
}

export type Qualifier = "varying" | "attribute" | "uniform"

export type Value<T extends ValueType = any> =
  | ValueToJSType[T]
  | Variable<T>
  | Chunk

export type Parameter<T extends ValueType = any> =
  | Value<T>
  | IShaderNodeWithDefaultOutput<T>

export type Variable<T extends ValueType = any> = {
  __variable: boolean
  name: string
  type: T
  value?: Value<T>
  node?: IShaderNode
  qualifier?: Qualifier
}

export type Variables = { [localName: string]: Variable<any> }

export type Parameters<V extends Variables | undefined> = V extends Variables
  ? { [K in keyof V]: Parameter<V[K]["type"]> }
  : {}

export const variable = <T extends ValueType>(type: T, value?: Parameter<T>) =>
  ({
    __variable: true,
    name: `var_${Math.floor(Math.random() * 10000000)}`,
    type,
    value: isShaderNodeWithDefaultOutput(value) ? value.outputs.value : value
  } as Variable<T>)

export const float = (value?: Parameter<"float">) => variable("float", value)
export const bool = (value?: Parameter<"bool">) => variable("bool", value)
export const vec2 = (value?: Parameter<"vec2">) => variable("vec2", value)
export const vec3 = (value?: Parameter<"vec3">) => variable("vec3", value)
export const vec4 = (value?: Parameter<"vec4">) => variable("vec4", value)
export const mat3 = (value?: Parameter<"mat3">) => variable("mat3", value)
export const mat4 = (value?: Parameter<"mat4">) => variable("mat4", value)

type AssignmentTarget<T extends ValueType> =
  | Variable<T>
  | IShaderNodeWithDefaultInput<T>

type AssignmentValue<T extends ValueType> = Parameter<T>

/**
 * Assigns the specified source value to the target. The source value can be
 * a variable, a value, or a node with a default `value` out variable; the
 * target value can be a variable, or a node with a default `a` input variable.
 *
 * @source source
 */
export const assign = <T extends ValueType>(
  target: AssignmentTarget<T>,
  source: AssignmentValue<T>
): void => {
  /* Is the target is a node, assign to its default input */
  if (isShaderNodeWithDefaultInput(target))
    return assign(target.inputs.a, source)

  /* If the source is a node, use its default output */
  const value = isShaderNodeWithDefaultOutput(source)
    ? source.outputs.value
    : source

  target.type = getValueType(value)
  target.value = value
}

export const set = <T extends ValueType>(target: AssignmentTarget<T>) => ({
  to: (source: AssignmentValue<T>) => assign(target, source)
})

/**
 * Returns the value type for the given value.
 */
export function getValueType<T extends ValueType>(value: Parameter<T>): T {
  if (isVariable(value)) {
    return value.type
  } else if (isShaderNodeWithDefaultOutput(value)) {
    return getValueType(value.outputs.value)
  } else if (typeof value === "number") {
    return "float" as T
  } else if (typeof value === "boolean") {
    return "bool" as T
  } else if (value instanceof Color) {
    return "vec3" as T
  } else if (value instanceof Vector2) {
    return "vec2" as T
  } else if (value instanceof Vector3) {
    return "vec3" as T
  } else if (value instanceof Vector4) {
    return "vec4" as T
  } else if (value instanceof Matrix3) {
    return "mat3" as T
  } else if (value instanceof Matrix4) {
    return "mat4" as T
  } else {
    throw new Error(`Could not find a GLSL type for: ${value}`)
  }
}

/*

 _______  _______  __   __  _______  ___   ___      _______  ______    _______
|       ||       ||  |_|  ||       ||   | |   |    |       ||    _ |  |       |
|       ||   _   ||       ||    _  ||   | |   |    |    ___||   | ||  |  _____|
|       ||  | |  ||       ||   |_| ||   | |   |    |   |___ |   |_||_ | |_____
|      _||  |_|  ||       ||    ___||   | |   |___ |    ___||    __  ||_____  |
|     |_ |       || ||_|| ||   |    |   | |       ||   |___ |   |  | | _____| |
|_______||_______||_|   |_||___|    |___| |_______||_______||___|  |_||_______|

*/

export const compileShader = (root: IShaderNode) => {
  /**
   * Renders the GLSL representation of a given variable value.
   */
  const compileValue = (value: Value): string => {
    /* Render strings verbatim, assuming they are a GLSL expression. */
    if (typeof value === "string") {
      return value
    }

    /* Always convert numbers to floats. */
    /* TODO: support ints! */
    if (typeof value === "number") {
      const s = value.toString()
      return s.match(/[.e]/) ? s : s + ".0"
    }

    /* Vector2 -> vec2 */
    if (value instanceof Vector2) {
      return `vec2(${compileValue(value.x)}, ${compileValue(value.y)})`
    }

    /* Vector3 -> vec3 */
    if (value instanceof Vector3) {
      return `vec3(${compileValue(value.x)}, ${compileValue(
        value.y
      )}, ${compileValue(value.z)})`
    }

    /* Color -> vec3 */
    if (value instanceof Color) {
      return `vec3(${compileValue(value.r)}, ${compileValue(
        value.g
      )}, ${compileValue(value.b)})`
    }

    /* Vector4 -> vec4 */
    if (value instanceof Vector4) {
      return `vec4(${compileValue(value.x)}, ${compileValue(
        value.y
      )}, ${compileValue(value.z)}, ${compileValue(value.w)})`
    }

    /* If the value is another variable, render that variable's name, since we want to source that variable. */
    if (isVariable(value)) {
      return value.name
    }

    /* If we got here, we couldn't render the value, so let's throw an error. */
    throw new Error("Could not render value for" + value)
  }

  /**
   * Renders the GLSL representation of the given variable's declaration.
   */
  const compileVariable = (variable: Variable) =>
    statement(
      variable.qualifier,
      variable.type,
      variable.name,
      variable.value !== undefined && ["=", compileValue(variable.value)]
    )

  /**
   * Returns an array of [localName, variable] pairs for the given variables object.
   */
  const getVariables = (variables: Variables | undefined) =>
    Object.entries(variables || {})

  /**
   * Returns the dependencies of the given shader node's input variables.
   */
  const getInputDependencies = (node: IShaderNode) =>
    unique(
      getVariables(node.inputs)
        .filter(([_, variable]) => isVariable(variable.value))
        .map(([_, variable]) => variable.value.node)
    )

  const getOutputDependencies = (node: IShaderNode) =>
    unique(
      getVariables(node.outputs)
        .filter(([_, variable]) => isVariable(variable.value))
        .map(([_, variable]) => variable.value.node)
    )

  const getDependencies = (node: IShaderNode) =>
    unique([
      ...getInputDependencies(node),
      ...getOutputDependencies(node),
      ...(node.filters || [])
    ])

  const nodeBegin = (node: IShaderNode) => `/*** BEGIN: ${node.name} ***/`
  const nodeEnd = (node: IShaderNode) => `/*** END: ${node.name} ***/\n`

  const compileHeader = (
    node: IShaderNode,
    programType: ProgramType,
    state = {
      seenNodes: new Set<IShaderNode>(),
      seenGlobals: new Set<string>()
    }
  ): Parts => {
    if (state.seenNodes.has(node)) return []
    state.seenNodes.add(node)

    const dependencies = getDependencies(node)

    return [
      /* Dependencies */
      dependencies.map((dependency) =>
        compileHeader(dependency, programType, state)
      ),

      nodeBegin(node),

      /* Uniforms */
      getVariables(node.uniforms).map(([name, v]) => {
        if (state.seenGlobals.has(name)) return
        state.seenGlobals.add(name)
        return compileVariable({
          ...v,
          qualifier: "uniform",
          name,
          value: undefined
        })
      }),

      /* Varyings */
      getVariables(node.varyings).map(([_, v]) =>
        compileVariable({ ...v, qualifier: "varying", value: undefined })
      ),

      /* Actual chunk */
      node[programType]?.header,

      nodeEnd(node),

      /* Filters */
      node.filters?.map((unit) => compileHeader(unit, programType, state))
    ]
  }

  const compileBody = (
    node: IShaderNode,
    programType: ProgramType,
    seen: Set<IShaderNode> = new Set()
  ): Parts => {
    if (seen.has(node)) return []
    seen.add(node)

    const inputs = getVariables(node.inputs)
    const outputs = getVariables(node.outputs)

    const dependenciesWithoutFilters = unique([
      ...getInputDependencies(node),
      ...getOutputDependencies(node)
    ])

    return [
      /* Dependencies */
      dependenciesWithoutFilters.map((dep) =>
        compileBody(dep, programType, seen)
      ),

      nodeBegin(node),

      /* Output Variable Declarations */
      outputs.map(([_, variable]) =>
        compileVariable({ ...variable, value: undefined })
      ),

      block(
        /* Build the inputs struct */
        node.inputs && [
          struct("inputs", node.inputs),

          inputs.map(([name, v]) =>
            v.value !== undefined
              ? assignment(`inputs.${name}`, compileValue(v.value))
              : ""
          )
        ],

        /* Local Varyings */
        programType === "vertex"
          ? getVariables(node.varyings).map(([localName, variable]) =>
              compileVariable({ ...variable, name: localName })
            )
          : getVariables(node.varyings).map(([localName, variable]) =>
              compileVariable({
                ...variable,
                name: localName,
                value: variable.name
              })
            ),

        /* Build the outputs struct */
        node.outputs && [
          struct("outputs", node.outputs),

          outputs.map(([name, v]) =>
            v.value ? assignment(`outputs.${name}`, compileValue(v.value)) : ""
          )
        ],

        /* Body */
        node[programType]?.body,

        /* Assign local output variables back to global variables */
        outputs.map(([localName, variable]) =>
          assignment(variable.name, "outputs." + localName)
        ),

        /* Filters */
        node.filters &&
          node.filters.length > 0 && [
            /* Render filters */
            node.filters.map((filter) =>
              compileBody(filter, programType, seen)
            ),

            /* Assign the last filter's output variable back into our output variable */
            assignment(
              node.outputs!.value.name,
              node.filters[node.filters.length - 1].outputs!.value.name
            )
          ],

        /* Assign Varyings */
        programType === "vertex" &&
          getVariables(node.varyings).map(
            ([localName, variable]) => `${variable.name} = ${localName};`
          )
      ),
      nodeEnd(node)
    ]
  }

  const compileProgram = (programType: ProgramType): string => {
    return concatenate(
      compileHeader(root, programType),
      "void main()",
      block(compileBody(root, programType))
    )
  }

  const prepareNode = (
    node: IShaderNode,
    state = { id: 0, seenNodes: new Set<IShaderNode>() }
  ) => {
    if (state.seenNodes.has(node)) return
    state.seenNodes.add(node)

    const deps = [...getInputDependencies(node), ...getOutputDependencies(node)]
    deps.forEach((unit) => prepareNode(unit, state))

    ++state.id

    const nodePartInVariableName = [sluggify(node.name || "node"), state.id]

    /* Tweak this node's output variable names */
    getVariables(node.outputs).map(([localName, variable]) => {
      variable.name = identifier("out", ...nodePartInVariableName, localName)
    })

    /* Tweak this node's varying names */
    getVariables(node.varyings).map(([localName, variable]) => {
      variable.name = identifier("v", ...nodePartInVariableName, localName)
    })

    /* Prepare filters */
    if (node.filters && node.filters.length > 0) {
      if (!isShaderNodeWithDefaultOutput(node))
        throw new Error("Nodes with filters must have an output value")

      /* Use the last filter's output value as our output value */
      const firstFilter = node.filters[0]

      if (!isShaderNodeWithDefaultInput(firstFilter))
        throw new Error("First filter node must have an `a` input")

      assign(firstFilter, node)

      prepareNode(firstFilter, state)

      /* Connect filters in sequence */
      for (let i = 1; i < node.filters.length; i++) {
        const filter = node.filters[i]
        const prev = node.filters[i - 1]

        prepareNode(filter, state)

        if (!isShaderNodeWithDefaultOutput(prev))
          throw new Error("Filter nodes must have a `value` output")

        if (!isShaderNodeWithDefaultInput(filter))
          throw new Error("Filter nodes must have an `a` input")

        assign(filter, prev)
      }
    }
  }

  prepareNode(root)

  const vertexShader = compileProgram("vertex")
  const fragmentShader = compileProgram("fragment")

  /* TODO: make the following dynamic */

  const uniforms = { u_time: { value: 0 }, u_resolution: { value: [0, 0] } }

  const update = (dt: number) => {
    uniforms.u_time.value += dt
    uniforms.u_resolution.value = [window.innerWidth, window.innerHeight]
  }

  return [{ vertexShader, fragmentShader, uniforms }, update] as const
}

/*
__   __  _______  ___      _______  _______  ______    _______
|  | |  ||       ||   |    |       ||       ||    _ |  |       |
|  |_|  ||    ___||   |    |    _  ||    ___||   | ||  |  _____|
|       ||   |___ |   |    |   |_| ||   |___ |   |_||_ | |_____
|       ||    ___||   |___ |    ___||    ___||    __  ||_____  |
|   _   ||   |___ |       ||   |    |   |___ |   |  | | _____| |
|__| |__||_______||_______||___|    |_______||___|  |_||_______|

*/

export const struct = (name: string, variables: Variables) =>
  Object.keys(variables).length > 0 &&
  statement(
    "struct {",
    Object.entries(variables).map(([name, v]) => statement(v.type, name)),
    "}",
    name
  )

export const isVariable = (value: any): value is Variable => !!value?.__variable

export const isShaderNodeWithDefaultInput = (
  value: any
): value is IShaderNodeWithDefaultInput => value?.inputs?.a !== undefined

export const isShaderNodeWithDefaultOutput = (
  value: any
): value is IShaderNodeWithDefaultOutput => value?.outputs?.value !== undefined

export const assertShaderNodeWithDefaultInput = (
  v: any
): asserts v is IShaderNodeWithDefaultInput => {
  if (!isShaderNodeWithDefaultInput(v))
    throw new Error(`Expected shader node with an 'a' input`)
}

export const assertShaderNodeWithDefaultOutput = (
  v: any
): asserts v is IShaderNodeWithDefaultOutput => {
  if (!isShaderNodeWithDefaultOutput(v))
    throw new Error(`Expected shader node with a 'value' output`)
}

const unique = (array: any[]) => [...new Set(array)]

const sluggify = (str: string) =>
  str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")

export const uniqueGlobalIdentifier = (name = "global") =>
  `${name}_${Math.floor(Math.random() * 10000000)}`
