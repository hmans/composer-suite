import { ShaderNode } from "./ShaderNode"
import { ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export class Compiler {
  constructor(public root: ShaderNode<any>) {}

  private renderedDependencies: ShaderNode<any>[] = []

  compile() {
    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    return { vertexShader, fragmentShader }
  }

  private compileProgram(programType: ProgramType) {
    this.renderedDependencies = []
    const header = this.compileProgramHeader(this.root, programType)

    this.renderedDependencies = []
    const body = this.compileProgramBody(this.root, programType)

    return `
      ${header}

      void main() {
        ${body}
      }
    `
  }

  private compileProgramHeader(
    node: ShaderNode<any>,
    programType: ProgramType
  ): string {
    if (this.renderedDependencies.includes(node)) return ""
    this.renderedDependencies.push(node)

    const dependencies = node.getDependencies()

    return `
      ${dependencies
        .map((dependency) => this.compileProgramHeader(dependency, programType))
        .join("\n\n")}

      /*** BEGIN: ${node.name} ***/
      ${node[programType].header ?? ""}
      /*** END: ${node.name} ***/
    `
  }

  private compileProgramBody(
    node: ShaderNode<any>,
    programType: ProgramType
  ): string {
    if (this.renderedDependencies.includes(node)) return ""
    this.renderedDependencies.push(node)

    const dependencies = node.getDependencies()

    return `
      ${dependencies
        .map((dependency) => this.compileProgramBody(dependency, programType))
        .join("\n\n")}

      /*** BEGIN: ${this.root.name} ***/

      /* Output Variables */
      ${this.renderVariables(node.outputs, (localName, variable) =>
        variable.render(false)
      )}

      {
        /* Input Variables */
        ${this.renderVariables(node.inputs, (localName, variable) =>
          variable.renderWithName("inputs_" + localName, true)
        )}

        /* Local Output Variables */
        ${this.renderVariables(node.outputs, (localName, variable) =>
          variable.renderWithName("outputs_" + localName)
        )}

        /* Body Chunk */
        {
          ${node[programType].body ?? ""}
        }

        /* TODO: Assign Output Variables */
        ${this.renderVariables(
          node.outputs,
          (localName, variable) => `
        ${variable.globalName} = outputs_${localName};`
        )}
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
