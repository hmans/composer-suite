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

export type ShaderNode = {
  name?: string

  vertex?: Program
  fragment?: Program

  in?: Variables
  out?: Variables
}

export interface IShaderNodeWithOutVariable<T extends ValueType = any> {
  out: { value: Variable<T> }
}

export const ShaderNode = <
  S extends ShaderNode,
  P extends Partial<VariableProps<S["in"]>>
>(
  node: S,
  props: P = {} as P
): S => {
  /* Assign a default name */
  node.name = node.name || "Unnamed Node"

  /* Assign variable owners */
  const variables = [
    ...Object.values(node.out || {}),
    ...Object.values(node.in || {})
  ]

  variables.forEach((variable) => {
    variable.node = node
    variable.name = ["processed", variable.type, variable.name].join("_")
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
  F extends (...args: any[]) => ShaderNode,
  S extends ShaderNode = ReturnType<F>,
  P = Partial<VariableProps<S["in"]>>
>(
  fac: F
) => (props: P = {} as P) => ShaderNode(fac(), props) as S

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
  node?: ShaderNode
}

export type Variables = { [localName: string]: Variable<any> }

export type VariableProp<V extends Variable> = Parameter<V["type"]>

export type VariableProps<V extends Variables | undefined> = V extends Variables
  ? { [K in keyof V]: VariableProp<V[K]> }
  : {}

export const variable = <T extends ValueType, V extends Variable<T>>(
  type: T,
  value?: Parameter<T>
) =>
  ({
    __variable: true,
    name: `var_${Math.floor(Math.random() * 10000000)}`,
    type,
    value: isShaderNodeWithOutVariable(value) ? value.out.value : value
  } as V)

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

const assign = <T extends ValueType>(
  variable: Variable<T>,
  value: Parameter<T>
) =>
  (variable.value = isShaderNodeWithOutVariable(value)
    ? value.out.value
    : value)

/**
 * Creates a new variable based on the given value's type, and sets its value... to the value.
 * Documentation is hard.
 */
export const inferVariable = (a: Value): Variable => {
  return variable(getValueType(a), a)
}

/**
 * Returns the value type for the given value.
 */
export function getValueType(value: Value): ValueType {
  if (isVariable(value)) {
    return value.type
  } else if (isShaderNodeWithOutVariable(value)) {
    return getValueType(value.out.value)
  } else if (typeof value === "number") {
    return "float"
  } else if (typeof value === "boolean") {
    return "bool"
  } else if (value instanceof Color) {
    return "vec3"
  } else if (value instanceof Vector2) {
    return "vec2"
  } else if (value instanceof Vector3) {
    return "vec3"
  } else if (value instanceof Vector4) {
    return "vec4"
  } else if (value instanceof Matrix3) {
    return "mat3"
  } else if (value instanceof Matrix4) {
    return "mat4"
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

export const compileShader = (root: ShaderNode) => {
  /**
   * Renders the GLSL representation of a given variable value.
   */
  const compileValue = (value: Value): string => {
    if (typeof value === "string") {
      return value
    } else if (typeof value === "number") {
      return value.toFixed(5) // TODO: no, make this better
    } else if (value instanceof Vector2) {
      return `vec2(${compileValue(value.x)}, ${compileValue(value.y)})`
    } else if (value instanceof Vector3) {
      return `vec3(${compileValue(value.x)}, ${compileValue(
        value.y
      )}, ${compileValue(value.z)})`
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
   * Returns the dependencies of the given shader node.
   */
  const getDependencies = (node: ShaderNode) =>
    unique(
      getVariables(node.in)
        .filter(([_, variable]) => isVariable(variable.value))
        .map(([_, variable]) => variable.value.node)
    )

  const nodeBegin = (node: ShaderNode) => `/*** BEGIN: ${node.name} ***/`
  const nodeEnd = (node: ShaderNode) => `/*** END: ${node.name} ***/\n`

  const compileHeader = (
    node: ShaderNode,
    programType: ProgramType,
    seen: Set<ShaderNode> = new Set()
  ): Parts => {
    if (seen.has(node)) return []
    seen.add(node)

    return [
      /* Dependencies */
      getVariables(node.in).map(([_, { value }]) =>
        isVariable(value) ? compileHeader(value.node!, programType, seen) : ""
      ),

      /* Actual chunk */
      nodeBegin(node),
      node[programType]?.header,
      nodeEnd(node)
    ]
  }

  const compileBody = (
    node: ShaderNode,
    programType: ProgramType,
    seen: Set<ShaderNode> = new Set()
  ): Parts => {
    if (seen.has(node)) return []
    seen.add(node)

    const ins = getVariables(node.in)
    const outs = getVariables(node.out)

    return [
      /* Dependencies */
      getDependencies(node).map((dep) => compileBody(dep, programType, seen)),

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

        /* Output Variables */
        outs.map(([localName, variable]) =>
          compileVariable({ ...variable, name: "out_" + localName })
        ),

        /* Body */
        node[programType]?.body,

        /* Assign local output variables back to global variables */
        outs.map(([localName, variable]) =>
          statement(variable.name, "=", "out_" + localName)
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

  const tweakVariableNames = (
    node: ShaderNode,
    state: { id: number } = { id: 0 }
  ) => {
    /* Tweak this node's output variable names */
    getVariables(node.out).map(([localName, variable]) => {
      variable.name = [
        "out",
        sluggify(variable.node!.name || "node"),
        ++state.id,
        localName
      ].join("_")
    })

    /* Do the same for all dependencies */
    getDependencies(node).forEach((dep) => tweakVariableNames(dep, state))
  }

  tweakVariableNames(root)

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
  parts
    .filter((p) => ![undefined, null, false].includes(p))
    .map((p) => (Array.isArray(p) ? lines(...p) : p))
    .flat()

const statement = (...parts: Parts) =>
  parts
    .flat()
    .filter((p) => ![undefined, null, false].includes(p))
    .join(" ") + ";"

export const isVariable = (value: any): value is Variable => !!value?.__variable

export const isShaderNodeWithOutVariable = (
  value: any
): value is IShaderNodeWithOutVariable => value?.out?.value !== undefined

const unique = (array: any[]) => [...new Set(array)]

const sluggify = (str: string) =>
  str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
