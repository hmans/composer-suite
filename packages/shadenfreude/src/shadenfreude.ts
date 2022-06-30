import { Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"

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
  vec3: Vector3
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
}

export type Value<T extends ValueType = any> =
  | ValueToJSType[T]
  | Variable<T>
  | Chunk

export type Variable<T extends ValueType = any> = {
  __variable: boolean
  name: string
  type: T
  value?: Value<T>
  node?: ShaderNode
}

export type Variables = { [localName: string]: Variable<any> }

export type VariableValues<
  V extends Variables | undefined
> = V extends Variables ? { [K in keyof V]: Value<V[K]["type"]> } : {}

export const variable = <T extends ValueType, V extends Variable<T>>(
  type: T,
  value?: Value<T>
) =>
  ({
    __variable: true,
    name: `var_${Math.floor(Math.random() * 10000000)}`,
    type,
    value
  } as V)

export const float = (value?: Value<"float">) => variable("float", value)
export const vec2 = (value?: Value<"vec2">) => variable("vec2", value)
export const vec3 = (value?: Value<"vec3">) => variable("vec3", value)
export const vec4 = (value?: Value<"vec4">) => variable("vec4", value)
export const mat3 = (value?: Value<"mat3">) => variable("mat3", value)
export const mat4 = (value?: Value<"mat4">) => variable("mat4", value)

export const plug = <T extends ValueType>(source: Variable<T>) => ({
  into: (target: Variable<T>) => {
    target.value = source
  }
})

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

  inputs?: Variables
  outputs?: Variables
}

export type ShaderNodeProps<S extends ShaderNode> = Partial<
  VariableValues<S["inputs"]>
>

export const ShaderNode = <S extends ShaderNode, P extends ShaderNodeProps<S>>(
  node: S,
  props: P = {} as P
): S => {
  /* Assign a default name */
  node.name = node.name || "Unnamed Node"

  assignVariableOwners(node)
  assignPropsToInputs(node, props)
  return node
}

const assignPropsToInputs = <S extends ShaderNode>(node: S, props: any) => {
  Object.entries(props).forEach(([name, value]) => {
    const variable = node.inputs?.[name]
    if (variable) {
      variable.value = value
    }
  })
}

const assignVariableOwners = (node: ShaderNode) => {
  const variables = [
    ...Object.values(node.outputs || {}),
    ...Object.values(node.inputs || {})
  ]

  variables.forEach((variable) => {
    variable.node = node
    variable.name = ["processed", variable.type, variable.name].join("_")
  })
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
      getVariables(node.inputs)
        .filter(([_, variable]) => isVariable(variable.value))
        .map(([_, variable]) => variable.value.node)
    )

  const nodeBegin = (node: ShaderNode) => `\n/*** BEGIN: ${node.name} ***/`
  const nodeEnd = (node: ShaderNode) => `/*** END: ${node.name} ***/\n`

  const compileHeader = (node: ShaderNode, programType: ProgramType): Parts => {
    return [
      /* Dependencies */
      getVariables(node.inputs).map(([_, { value }]) =>
        isVariable(value) ? compileHeader(value.node!, programType) : ""
      ),

      /* Actual chunk */
      nodeBegin(node),
      node[programType]?.header,
      nodeEnd(node)
    ]
  }

  const compileBody = (node: ShaderNode, programType: ProgramType): Parts => {
    const inputs = getVariables(node.inputs)
    const outputs = getVariables(node.outputs)

    return [
      /* Dependencies */
      getDependencies(node).map((dep) => compileBody(dep, programType)),

      nodeBegin(node),

      /* Output Variable Declarations */
      outputs.map(([_, variable]) =>
        compileVariable({ ...variable, value: undefined })
      ),

      block(
        /* Input Variables */
        inputs.map(([localName, variable]) =>
          compileVariable({ ...variable, name: localName })
        ),

        /* Output Variables */
        outputs.map(([localName, variable]) =>
          compileVariable({ ...variable, name: localName })
        ),

        /* Body */
        node[programType]?.body && [node[programType]?.body],

        /* Assign local output variables back to global variables */
        outputs.map(([localName, variable]) =>
          statement(variable.name, "=", localName)
        )
      ),
      nodeEnd(node)
    ]
  }

  const compileProgram = (programType: ProgramType) => {
    return lines(
      compileHeader(root, programType),
      "void main() {",
      compileBody(root, programType),
      "}"
    )
  }

  const tweakVariableNames = (
    node: ShaderNode,
    state: { id: number } = { id: 0 }
  ) => {
    /* Tweak this node's output variable names */
    getVariables(node.outputs).map(([localName, variable]) => {
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

  return { vertexShader, fragmentShader }
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

const block = (...parts: Parts) => lines("{", ...parts, "}")

const lines = (...parts: Parts): string =>
  parts
    .filter((l) => l !== undefined && l !== null)
    .map((l) => (Array.isArray(l) ? lines(...l) : l))
    .flat()
    .join("\n")

const statement = (...parts: Parts) =>
  parts
    .flat()
    .filter((p) => ![undefined, null, false].includes(p))
    .join(" ") + ";"

const isVariable = (value: any): value is Variable => !!value?.__variable

const unique = (array: any[]) => [...new Set(array)]

const sluggify = (str: string) =>
  str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
