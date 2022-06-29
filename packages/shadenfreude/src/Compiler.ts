import { ShaderNode } from "./ShaderNode"
import { ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export class Compiler {
  constructor(public root: ShaderNode<any>) {}

  compile() {
    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    return { vertexShader, fragmentShader }
  }

  private compileProgram(programType: ProgramType) {
    return `
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
      /* TODO: Dependencies */

      /*** BEGIN: ${this.root.name} ***/
      ${node[programType].header ?? ""}
      /*** END: ${this.root.name} ***/
    `
  }

  private compileProgramBody(
    node: ShaderNode<any>,
    programType: ProgramType
  ): string {
    const dependencies = node.getDependencies()

    return `
      ${dependencies
        .map((dependency) => this.compileProgramBody(dependency, programType))
        .join("\n\n")}

      /*** BEGIN: ${this.root.name} ***/

      /* Output Variables */
      ${this.renderVariables(node.outputs, (_, variable) => variable.render())}

      {
        /* Input Variables */
        ${this.renderVariables(node.inputs, (localName, variable) =>
          variable.renderWithName("input_" + localName)
        )}

        /* Body Chunk */
        ${node[programType].body ?? ""}

        /* TODO: Assign Output Variables */
      }

      /*** END: ${this.root.name} ***/
    `
  }

  private renderVariables(
    variables: Variables,
    callback: (localName: string, variable: Variable) => string
  ) {
    return Object.entries(variables)
      .map(([name, variable]) => callback(name, variable))
      .join("\n")
  }
}
