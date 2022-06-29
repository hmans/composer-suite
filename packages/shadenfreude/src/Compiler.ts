import { ShaderNode } from "./ShaderNode"
import { ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export class Compiler {
  constructor(public root: ShaderNode) {}

  private renderedDependencies: ShaderNode[] = []
  private nodeCounter = 0

  compile() {
    this.prepareNode()

    const vertexShader = this.compileProgram("vertex")
    const fragmentShader = this.compileProgram("fragment")

    const uniforms = { u_time: { value: 0 } }

    const update = (dt: number) => {
      uniforms.u_time.value += dt
    }

    return { vertexShader, fragmentShader, uniforms, update }
  }

  private prepareNode(node: ShaderNode = this.root) {
    /* Generate slug if none is given */
    node.slug =
      node.slug ||
      node.name
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .replace(/_{2,}/g, "_")
        .toLowerCase()

    /* Assign better names to output variables */
    for (const [localName, variable] of Object.entries(node.outputs)) {
      variable.globalName = [
        node.slug,
        this.nodeCounter++,
        variable.type,
        localName
      ].join("_")
    }

    node.getDependencies().forEach((dependency) => this.prepareNode(dependency))
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
    node: ShaderNode,
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
    node: ShaderNode,
    programType: ProgramType
  ): string {
    if (this.renderedDependencies.includes(node)) return ""
    this.renderedDependencies.push(node)

    const dependencies = node.getDependencies()

    return `
      ${dependencies
        .map((dependency) => this.compileProgramBody(dependency, programType))
        .join("\n\n\n")}

      /*** BEGIN: ${node.name} ***/

      /* Output Variables */
      ${this.renderVariables(node.outputs, (localName, variable) =>
        variable.render(false)
      )}

      {
        /* Input Variables */
        ${this.renderVariables(node.inputs, (localName, variable) =>
          variable.renderWithName("in_" + localName, true)
        )}

        /* Local Output Variables */
        ${this.renderVariables(node.outputs, (localName, variable) =>
          variable.renderWithName("out_" + localName)
        )}

        /* Body Chunk */
        {
          ${node[programType].body ?? ""}
        }

        /* TODO: Assign Output Variables */
        ${this.renderVariables(
          node.outputs,
          (localName, variable) => `
        ${variable.globalName} = out_${localName};`
        )}
      }

      /*** END: ${node.name} ***/
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
