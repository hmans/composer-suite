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

export type Value<T extends GLSLType> =
  | GLSLtoJSType<T>
  | Variable<T>
  | GLSLChunk

export type Variable<T extends GLSLType> = {
  __variable: true
  globalName: string
  type: T
  value?: Value<T>
  node?: ShaderNode
}

export type Variables = { [localName: string]: Variable<GLSLType> }

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
}

export type ShaderNodeFactory = () => ShaderNode

/*

 __   __  _______  ______    ___   _______  _______  ___      _______  _______
|  | |  ||   _   ||    _ |  |   | |   _   ||  _    ||   |    |       ||       |
|  |_|  ||  |_|  ||   | ||  |   | |  |_|  || |_|   ||   |    |    ___||  _____|
|       ||       ||   |_||_ |   | |       ||       ||   |    |   |___ | |_____
|       ||       ||    __  ||   | |       ||  _   | |   |___ |    ___||_____  |
 |     | |   _   ||   |  | ||   | |   _   || |_|   ||       ||   |___  _____| |
  |___|  |__| |__||___|  |_||___| |__| |__||_______||_______||_______||_______|

*/

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
  const compileHeader = (node: ShaderNode, programType: ProgramType) => {
    return `
      /* TODO: dependencies */

      ${node[programType]?.header ?? ""}
    `
  }

  const compileBody = (node: ShaderNode, programType: ProgramType) => {
    return `
      /* TODO: dependencies */

      ${node[programType]?.header ?? ""}
    `
  }

  const compileProgram = (programType: ProgramType) => {
    return `
      ${compileHeader(root, programType)}

      void main() {
        ${compileBody(root, programType)}
      }
    `
  }

  const vertexShader = compileProgram("vertex")
  const fragmentShader = compileProgram("fragment")

  return { vertexShader, fragmentShader }
}
