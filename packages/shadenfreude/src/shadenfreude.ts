import { Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"

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
  slug?: string

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

 _______  _______  __   __  _______  ___   ___      _______  ______    _______
|       ||       ||  |_|  ||       ||   | |   |    |       ||    _ |  |       |
|       ||   _   ||       ||    _  ||   | |   |    |    ___||   | ||  |  _____|
|       ||  | |  ||       ||   |_| ||   | |   |    |   |___ |   |_||_ | |_____
|      _||  |_|  ||       ||    ___||   | |   |___ |    ___||    __  ||_____  |
|     |_ |       || ||_|| ||   |    |   | |       ||   |___ |   |  | | _____| |
|_______||_______||_|   |_||___|    |___| |_______||_______||___|  |_||_______|

*/

export const compileShader = (root: ShaderNode) => {
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

  const compileVariable = (variable: Variable) =>
    statement(
      variable.type,
      variable.name,
      variable.value !== undefined && ["=", compileValue(variable.value)]
    )

  const compileVariables = (
    variables: Variables | undefined,
    callback: (localName: string, variable: Variable) => string
  ) =>
    variables &&
    Object.entries(variables).map(([localName, variable]) =>
      callback(localName, variable)
    )

  const compileHeader = (node: ShaderNode, programType: ProgramType) => {
    /* TODO: dependencies */
    return [node[programType]?.header]
  }

  const compileBody = (node: ShaderNode, programType: ProgramType): any[] => {
    const dependencies =
      node.inputs &&
      Object.values(node.inputs).map(({ value }) =>
        isVariable(value) ? compileBody(value.node!, programType) : ""
      )

    const outputVariableDeclarations = compileVariables(
      node.outputs,
      (_, variable) => compileVariable({ ...variable, value: undefined })
    )

    const inputVariables = compileVariables(
      node.inputs,
      (localName, variable) => compileVariable({ ...variable, name: localName })
    )

    const outputVariables = compileVariables(
      node.outputs,
      (localName, variable) => compileVariable({ ...variable, name: localName })
    )

    const body = node[programType]?.body && [node[programType]?.body]

    const outputVariableAssignments = compileVariables(
      node.outputs,
      (localName, variable) => statement(variable.name, "=", localName)
    )

    return [
      dependencies,
      `\n/*** BEGIN: ${node.name} ***/`,
      outputVariableDeclarations,
      "{",
      inputVariables,
      outputVariables,
      body,
      outputVariableAssignments,
      "}",
      `/*** END: ${node.name} ***/\n`
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

const lines = (...inputs: any[]): string =>
  inputs
    .filter((l) => l !== undefined && l !== null)
    .map((l) => (Array.isArray(l) ? lines(...l) : l))
    .flat()
    .join("\n")

const statement = (...parts: any[]) =>
  parts
    .flat()
    .filter((p) => ![undefined, null, false].includes(p))
    .join(" ") + ";"

const isVariable = (value: any): value is Variable => !!value.__variable
