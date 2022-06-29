import { GLSLType, Program, ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export abstract class ShaderNode<T extends GLSLType> {
  name: string = "Unnamed Shader Node"

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  outputs: Variables & { value: Variable<T> } = {
    value: new Variable<T>()
  }

  compile() {
    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    return { vertexShader, fragmentShader }
  }

  private compileProgram(type: ProgramType) {
    const { header, body } = this[type]

    return `
      /* START: ${this.name} */
      ${header ?? ""}

      void main() {
        ${body ?? ""}
      }
    `
  }
}
