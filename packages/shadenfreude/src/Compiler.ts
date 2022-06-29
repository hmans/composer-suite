import { ShaderNode } from "./ShaderNode"
import { ProgramType } from "./types"

export class Compiler {
  constructor(public root: ShaderNode<any>) {}

  compile() {
    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    return { vertexShader, fragmentShader }
  }

  private compileProgram(type: ProgramType) {
    const { header, body } = this.root[type]

    return `
      /* START: ${this.root.name} */
      ${header ?? ""}

      void main() {
        ${body ?? ""}
      }
    `
  }
}
