import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"

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

export interface IShaderNode {
  name?: string

  vertex?: Program
  fragment?: Program

  uniforms?: Variables
  varyings?: Variables
  inputs?: Variables
  outputs?: Variables

  filters?: IShaderNode[]
}

export interface IShaderNodeWithDefaultIn<T extends ValueType = any>
  extends IShaderNode {
  inputs: { a: Variable<T> }
}

export interface IShaderNodeWithDefaultOut<T extends ValueType = any>
  extends IShaderNode {
  outputs: { value: Variable<T> }
}

export const ShaderNode = <
  S extends IShaderNode,
  P extends Partial<VariableProps<S["inputs"]>>
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

    if (isShaderNodeWithOutVariable(prop)) {
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
  Props = Partial<VariableProps<S["inputs"]>>
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

export type ValueType = keyof ValueToJSType

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
  | IShaderNodeWithDefaultOut<T>

export type Variable<T extends ValueType = any> = {
  __variable: boolean
  name: string
  type: T
  value?: Value<T>
  node?: IShaderNode
  qualifier?: Qualifier
}

export type Variables = { [localName: string]: Variable<any> }

export type VariableProp<V extends Variable> = Parameter<V["type"]>

export type VariableProps<V extends Variables | undefined> = V extends Variables
  ? { [K in keyof V]: VariableProp<V[K]> }
  : {}

export const variable = <T extends ValueType>(type: T, value?: Parameter<T>) =>
  ({
    __variable: true,
    name: `var_${Math.floor(Math.random() * 10000000)}`,
    type,
    value: isShaderNodeWithOutVariable(value) ? value.outputs.value : value
  } as Variable<T>)

export const float = (value?: Parameter<"float">) => variable("float", value)
export const vec2 = (value?: Parameter<"vec2">) => variable("vec2", value)
export const vec3 = (value?: Parameter<"vec3">) => variable("vec3", value)
export const vec4 = (value?: Parameter<"vec4">) => variable("vec4", value)
export const mat3 = (value?: Parameter<"mat3">) => variable("mat3", value)
export const mat4 = (value?: Parameter<"mat4">) => variable("mat4", value)

export const plug = <T extends ValueType>(source: Parameter<T>) => ({
  into: (target: Variable<T> | IShaderNodeWithDefaultIn<T>) =>
    assign(source).to(target)
})

/**
 * Assigns the specified source value to the target. The source value can be
 * a variable, a value, or a node with a default `value` out variable; the
 * target value can be a variable, or a node with a default `a` input variable.
 *
 * @source source
 */
export const assign = <T extends ValueType>(source: Parameter<T>) => ({
  to: (target: Variable<T> | IShaderNodeWithDefaultIn<T>): void => {
    if (isShaderNodeWithInVariable(target))
      return assign(source).to(target.inputs.a)

    const value = isShaderNodeWithOutVariable(source)
      ? source.outputs.value
      : source

    /* Test type match */
    const valueType = getValueType(value)
    if (target.type !== valueType) {
      throw new Error(`Tried to assign ${valueType} to ${target.type}`)
    }

    target.value = value
  }
})

/**
 * Returns the value type for the given value.
 */
export function getValueType<T extends ValueType>(value: Parameter<T>): T {
  if (isVariable(value)) {
    return value.type
  } else if (isShaderNodeWithOutVariable(value)) {
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
    if (typeof value === "string") {
      return value
    } else if (typeof value === "number") {
      const s = value.toString()
      return s.match(/[.e]/) ? s : s + ".0"
    } else if (value instanceof Vector2) {
      return `vec2(${compileValue(value.x)}, ${compileValue(value.y)})`
    } else if (value instanceof Vector3) {
      return `vec3(${compileValue(value.x)}, ${compileValue(
        value.y
      )}, ${compileValue(value.z)})`
    } else if (value instanceof Color) {
      return `vec3(${compileValue(value.r)}, ${compileValue(
        value.g
      )}, ${compileValue(value.b)})`
    } else if (value instanceof Vector4) {
      return `vec4(${compileValue(value.x)}, ${compileValue(
        value.y
      )}, ${compileValue(value.z)}, ${compileValue(value.w)})`
    } else if (isVariable(value)) {
      return value.name
    } else {
      throw new Error("Could not render value for" + value)
    }
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

    const header = [
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

    return header
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

  const compileProgram = (programType: ProgramType) => {
    return lines(
      compileHeader(root, programType),
      "void main()",
      block(compileBody(root, programType))
    ).join("\n")
  }

  const prepareNode = (
    node: IShaderNode,
    state = { id: 0, seenNodes: new Set<IShaderNode>() }
  ) => {
    if (state.seenNodes.has(node)) return
    state.seenNodes.add(node)

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
      if (!isShaderNodeWithOutVariable(node))
        throw new Error("Nodes with filters must have an output value")

      /* Use the last filter's output value as our output value */
      const lastFilter = node.filters[node.filters.length - 1]
      const firstFilter = node.filters[0]

      if (!isShaderNodeWithInVariable(firstFilter))
        throw new Error("Filter nodes must have an `a` input")

      if (!isShaderNodeWithOutVariable(lastFilter))
        throw new Error("Filter nodes must have a `value` output")

      plug(node).into(firstFilter)

      /* Connect filters in sequence */
      for (let i = 1; i < node.filters.length; i++) {
        const filter = node.filters[i]
        const prev = node.filters[i - 1]

        if (!isShaderNodeWithOutVariable(prev))
          throw new Error("Filter nodes must have a `value` output")

        if (!isShaderNodeWithInVariable(filter))
          throw new Error("Filter nodes must have an `a` input")

        plug(prev).into(filter)
      }
    }

    /* Do the same for all filters and dependencies */
    getDependencies(node).forEach((unit) => prepareNode(unit, state))
  }

  prepareNode(root)

  const vertexShader = compileProgram("vertex")
  const fragmentShader = compileProgram("fragment")
  const uniforms = { u_time: { value: 0 } }
  const update = (dt: number) => (uniforms.u_time.value += dt)

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

type Parts = any[]

const block = (...parts: Parts) =>
  lines(
    "{",
    lines(parts).map((p) => "  " + p),
    "}"
  )

const lines = (...parts: Parts): string[] =>
  compact(parts.map((p) => (Array.isArray(p) ? lines(...p) : p)).flat())

export const statement = (...parts: Parts) =>
  compact(parts.flat()).join(" ") + ";"

export const assignment = (left: string, right: string) =>
  statement(left, "=", right)

const identifier = (...parts: Parts) =>
  compact(parts.flat())
    .join("_")
    .replace(/_{2,}/g, "_")

const struct = (name: string, variables: Variables) =>
  Object.keys(variables).length > 0
    ? statement(
        "struct {",
        Object.entries(variables).map(([name, v]) => statement(v.type, name)),
        "}",
        name
      )
    : ""

export const isVariable = (value: any): value is Variable => !!value?.__variable

export const isShaderNodeWithInVariable = (
  value: any
): value is IShaderNodeWithDefaultIn => value?.inputs?.a !== undefined

export const isShaderNodeWithOutVariable = (
  value: any
): value is IShaderNodeWithDefaultOut => value?.outputs?.value !== undefined

const unique = (array: any[]) => [...new Set(array)]

const compact = (array: any[]) =>
  array.filter((p) => ![undefined, null, false].includes(p))

const sluggify = (str: string) =>
  str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
