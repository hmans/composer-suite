import { ShaderNode } from "./ShaderNode"
import { ProgramType } from "./types"

export class Compiler {
  constructor(public root: ShaderNode<any>) {}

  compile() {
    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    return { vertexShader, fragmentShader }
  }

  private compileProgram(programType: ProgramType) {
    return `
      /* START: ${this.root.name} */
      ${this.compileProgramHeader(this.root, programType)}

      void main() {
        ${this.compileProgramBody(this.root, programType)}
      }
    `
  }

  private compileProgramHeader(
    node: ShaderNode<any>,
    programType: ProgramType
  ) {
    return `
      ${node[programType].header ?? ""}
    `
  }

  private compileProgramBody(node: ShaderNode<any>, programType: ProgramType) {
    return `
      {
        /* Input Variables */

        /* Body Chunk */
        ${node[programType].body ?? ""}
      }
    `
  }
}
