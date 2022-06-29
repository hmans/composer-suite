import { Matrix3, Vector2, Vector3, Vector4 } from "three"

/*

_______  __   __  _______  _______  _______
|       ||  | |  ||       ||       ||       |
|_     _||  |_|  ||    _  ||    ___||  _____|
  |   |  |       ||   |_| ||   |___ | |_____
  |   |  |_     _||    ___||    ___||_____  |
  |   |    |   |  |   |    |   |___  _____| |
  |___|    |___|  |___|    |_______||_______|

  */

export type GLSLChunk = string | string[]

export type GLSLType =
  | "string"
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"

export type GLSLtoJSType<T extends GLSLType> = T extends "bool"
  ? boolean
  : T extends "float"
  ? number
  : T extends "vec2"
  ? Vector2
  : T extends "vec3"
  ? Vector3
  : T extends "vec4"
  ? Vector4
  : T extends "mat3"
  ? Matrix3
  : T extends "mat4"
  ? Matrix3
  : never

export type Program = {
  header?: GLSLChunk
  body?: GLSLChunk
}

export type ProgramType = "vertex" | "fragment"

export type Value<T extends GLSLType = any> =
  | GLSLtoJSType<T>
  | Variable<T>
  | GLSLChunk

export type Variable<T extends GLSLType = any> = {
  __variable: boolean
  name: string
  type: T
  value?: Value<T>
  node?: ShaderNode
}

export type Variables = { [localName: string]: Variable<any> }

export type VariableValues<
  V extends Variables | undefined
> = V extends Variables ? { [K in keyof V]: V[K]["value"] } : never

/*

 __    _  _______  ______   _______  _______
|  |  | ||       ||      | |       ||       |
|   |_| ||   _   ||  _    ||    ___||  _____|
|       ||  | |  || | |   ||   |___ | |_____
|  _    ||  |_|  || |_|   ||    ___||_____  |
| | |   ||       ||       ||   |___  _____| |
|_|  |__||_______||______| |_______||_______|

*/

export type ShaderNode = {
  name?: string
  slug?: string

  vertex?: Program
  fragment?: Program

  inputs?: Variables
  outputs?: Variables
}

export const node = <S extends ShaderNode>(node: S): S => {
  /* Process input variables */
  Object.entries(node.inputs || {}).forEach(([localName, variable]) => {
    variable.node = node
    variable.name = ["var", variable.type, variable.name].join("_n")
  })

  return node
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

export const variable = <T extends GLSLType, V extends Variable<T>>(
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

export const pipe = <T extends GLSLType>(source: Variable<T>) => ({
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

export const Compiler = (root: ShaderNode) => {
  const compileVariables = (
    variables: Variables,
    callback: (localName: string, variable: Variable) => string
  ) =>
    Object.entries(variables).map(([localName, variable]) =>
      callback(localName, variable)
    )

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

  const compileHeader = (node: ShaderNode, programType: ProgramType) => {
    /* TODO: dependencies */
    return [node[programType]?.header]
  }

  const compileBody = (node: ShaderNode, programType: ProgramType): any[] => {
    const dependencies = getDependencies(node)
    console.log(dependencies)

    return [
      // dependencies.map((dependency) => compileBody(dependency, programType)),

      `  /*** BEGIN: ${node.name} ***/\n`,

      node.outputs && [
        "/* Output variables */",
        ...compileVariables(node.outputs, (localName, variable) =>
          compileVariable({ ...variable, value: undefined })
        ),
        ""
      ],

      [
        "{",

        node.inputs && [
          "/* Input Variables */",
          ...compileVariables(node.inputs, (localName, variable) =>
            compileVariable({ ...variable, name: localName })
          ),
          ""
        ],

        node.outputs && [
          "/* Local output variables */",
          ...compileVariables(node.outputs, (localName, variable) =>
            compileVariable({ ...variable, name: localName })
          ),
          ""
        ],

        node[programType]?.body && [
          "/* Body Chunk */",
          node[programType]?.body,
          ""
        ],

        node.outputs && [
          "/* Output variable assignments */",
          ...compileVariables(node.outputs, (localName, variable) =>
            statement(variable.name, "=", localName)
          ),
          ""
        ],

        "}\n"
      ],

      `  /*** END: ${node.name} ***/`
    ]
  }

  const compileProgram = (programType: ProgramType) => {
    return lines(
      ...compileHeader(root, programType),
      "void main() {",
      ...compileBody(root, programType),
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

type Lines = any[]

const lines = (...inputs: Lines): string =>
  inputs
    .filter((l) => l !== undefined && l !== null)
    .map((l) => (Array.isArray(l) ? lines(...l) : l))
    .join("\n")
    .split("\n")
    .map((l) => "  " + l)
    .join("\n")

const statement = (...parts: Lines) =>
  parts
    .flat()
    .filter((p) => ![undefined, null, false].includes(p))
    .join(" ") + ";"

const getDependencies = ({ inputs }: ShaderNode) => [
  ...Object.values(inputs || {}).reduce((set, { value }) => {
    if (value && isVariable(value)) {
      value.node && set.add(value.node!)
    }
    return set
  }, new Set<ShaderNode>())
]

const isVariable = (value: any): value is Variable => !!value.__variable
