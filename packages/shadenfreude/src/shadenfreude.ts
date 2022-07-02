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
  in?: Variables
  out?: Variables

  filters?: IShaderNode[]
}

export interface IShaderNodeWithInVariable<T extends ValueType = any> {
  [key: string]: any
  in: { a: Variable<T> }
}

export interface IShaderNodeWithOutVariable<T extends ValueType = any> {
  [key: string]: any
  out: { value: Variable<T> }
}

export const ShaderNode = <
  S extends IShaderNode,
  P extends Partial<VariableProps<S["in"]>>
>(
  node: S,
  props: P = {} as P
): S => {
  /* Assign a default name */
  node.name = node.name || "Unnamed Node"

  /* Assign variable owners */
  const variables = [
    ...Object.values(node.varyings || {}),
    ...Object.values(node.out || {}),
    ...Object.values(node.in || {})
  ]

  variables.forEach((variable) => {
    variable.node = node
  })

  /* Assign props to input variables */
  Object.entries(props).forEach(([name, prop]) => {
    const variable = node.in?.[name]
    if (!variable) return

    if (isShaderNodeWithOutVariable(prop)) {
      variable.value = prop.out.value
    } else {
      variable.value = prop
    }
  })

  return node
}

export const Factory = <
  Opts extends { [key: string]: any },
  F extends (opts: Opts) => IShaderNode = (opts: Opts) => IShaderNode,
  S extends IShaderNode = ReturnType<F>,
  Props = Partial<VariableProps<S["in"]>>
>(
  fac: F
) => (props: Props = {} as Props, opts: Opts = {} as Opts) =>
  ShaderNode(fac(opts), props) as S

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
  | IShaderNodeWithOutVariable<T>

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
    value: isShaderNodeWithOutVariable(value) ? value.out.value : value
  } as Variable<T>)

export const float = (value?: Parameter<"float">) => variable("float", value)
export const vec2 = (value?: Parameter<"vec2">) => variable("vec2", value)
export const vec3 = (value?: Parameter<"vec3">) => variable("vec3", value)
export const vec4 = (value?: Parameter<"vec4">) => variable("vec4", value)
export const mat3 = (value?: Parameter<"mat3">) => variable("mat3", value)
export const mat4 = (value?: Parameter<"mat4">) => variable("mat4", value)

export const plug = <S extends Variable, T extends Variable>(
  source: VariableProp<S>
) => ({
  into: (target: T) => assign(target, source)
})

export const assign = <T extends ValueType>(
  variable: Variable<T>,
  value: Parameter<T>
) =>
  (variable.value = isShaderNodeWithOutVariable(value)
    ? value.out.value
    : value)

/**
 * Returns the value type for the given value.
 */
export function getValueType<T extends ValueType>(value: Parameter<T>): T {
  if (isVariable(value)) {
    return value.type
  } else if (isShaderNodeWithOutVariable(value)) {
    return getValueType(value.out.value)
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
      getVariables(node.in)
        .filter(([_, variable]) => isVariable(variable.value))
        .map(([_, variable]) => variable.value.node)
    )

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

    const header = [
      /* Dependencies */
      getVariables(node.in).map(([_, { value }]) =>
        isVariable(value) ? compileHeader(value.node!, programType, state) : ""
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

    const ins = getVariables(node.in)
    const outs = getVariables(node.out)

    return [
      /* Dependencies */
      getInputDependencies(node).map((dep) =>
        compileBody(dep, programType, seen)
      ),

      nodeBegin(node),

      /* Output Variable Declarations */
      outs.map(([_, variable]) =>
        compileVariable({ ...variable, value: undefined })
      ),

      block(
        /* Input Variables */
        ins.map(([localName, variable]) =>
          compileVariable({ ...variable, name: "in_" + localName })
        ),

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

        /* Output Variables */
        outs.map(([localName, variable]) =>
          compileVariable({ ...variable, name: "out_" + localName })
        ),

        /* Body */
        node[programType]?.body,

        /* Assign local output variables back to global variables */
        outs.map(([localName, variable]) =>
          assignment(variable.name, "out_" + localName)
        ),

        /* Filters */
        node.filters && [
          /* Render filters */
          node.filters.map((filter) => compileBody(filter, programType, seen)),

          /* Assign the last filter's output variable back into our output variable */
          assignment(
            node.out!.value.name,
            node.filters[node.filters.length - 1].out!.value.name
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
    getVariables(node.out).map(([localName, variable]) => {
      variable.name = identifier("out", ...nodePartInVariableName, localName)
    })

    /* Tweak this node's varying names */
    getVariables(node.varyings).map(([localName, variable]) => {
      variable.name = identifier("v", ...nodePartInVariableName, localName)
    })

    /* Prepare filters */
    if (node.filters) {
      if (!isShaderNodeWithOutVariable(node))
        throw new Error("Nodes with filters must have an output value")

      /* Use the last filter's output value as our output value */
      const lastFilter = node.filters[node.filters.length - 1]
      const firstFilter = node.filters[0]

      if (!isShaderNodeWithInVariable(firstFilter))
        throw new Error("Filter nodes must have an `a` input")

      if (!isShaderNodeWithOutVariable(lastFilter))
        throw new Error("Filter nodes must have a `value` output")

      firstFilter.in.a = node.out.value

      /* Connect filters in sequence */
      for (let i = 1; i < node.filters.length; i++) {
        const filter = node.filters[i]
        const prev = node.filters[i - 1]

        if (!isShaderNodeWithOutVariable(prev))
          throw new Error("Filter nodes must have a `value` output")

        if (!isShaderNodeWithInVariable(filter))
          throw new Error("Filter nodes must have an `a` input")

        filter.in.a.value = prev.out.value
      }
    }

    /* Do the same for all filters and dependencies */
    const deps = [...getInputDependencies(node), ...(node.filters || [])]
    deps.forEach((unit) => prepareNode(unit, state))
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

const statement = (...parts: Parts) => compact(parts.flat()).join(" ") + ";"

const assignment = (left: string, right: string) => statement(left, "=", right)

const identifier = (...parts: Parts) =>
  compact(parts.flat())
    .join("_")
    .replace(/_{2,}/g, "_")

export const isVariable = (value: any): value is Variable => !!value?.__variable

export const isShaderNodeWithInVariable = (
  value: any
): value is IShaderNodeWithInVariable => value?.in?.a !== undefined

export const isShaderNodeWithOutVariable = (
  value: any
): value is IShaderNodeWithOutVariable => value?.out?.value !== undefined

const unique = (array: any[]) => [...new Set(array)]

const compact = (array: any[]) =>
  array.filter((p) => ![undefined, null, false].includes(p))

const sluggify = (str: string) =>
  str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
