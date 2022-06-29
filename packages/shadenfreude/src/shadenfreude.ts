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

export type Variables = { [localName: string]: Variable<GLSLType> }

export type ShaderNodeOptions = { [key: string]: any }

/*

 __    _  _______  ______   _______  _______
|  |  | ||       ||      | |       ||       |
|   |_| ||   _   ||  _    ||    ___||  _____|
|       ||  | |  || | |   ||   |___ | |_____
|  _    ||  |_|  || |_|   ||    ___||_____  |
| | |   ||       ||       ||   |___  _____| |
|_|  |__||_______||______| |_______||_______|

*/

export type ShaderNodeProps<T extends ShaderNode> = {
  [Key in keyof T["inputs"]]: T["inputs"][Key]["value"]
}

export function node<T extends ShaderNode>(
  klass: new (...args: any[]) => T,
  props: ShaderNodeProps<T>
): T {
  const node = new klass(props)
  Object.entries(props).forEach(([key, value]) => {
    node.inputs[key].set(value)
  })
  return node
}

export abstract class ShaderNode<O extends ShaderNodeOptions = {}> {
  constructor(protected props: any = {}, protected opts: O = {} as O) {}

  /** Human-readable name. */
  name: string = "Unnamed Shader Node"

  /** Machine-readable name; will be used as part of GLSL variable names. */
  slug?: string

  vertex: Program = {}
  fragment: Program = {}
  inputs: Variables = {}
  outputs: Variables = {}

  /** Returns this node's immediate dependencies. */
  getDependencies() {
    const dependencies = new Set<ShaderNode>()

    for (const input of Object.values(this.inputs)) {
      if (input.value instanceof Variable) {
        dependencies.add(input.value.node)
      }
    }

    return [...dependencies]
  }

  /** Creates a variable of the specified type, linked to this node. */
  variable<T extends GLSLType>(type: T, value?: Value<T>): Variable<T> {
    const variable = new Variable(this, type, value)
    return variable
  }

  float(value?: Value<"float">) {
    return this.variable("float", value)
  }

  vec3(value?: Value<"vec3">) {
    return this.variable("vec3", value)
  }
}

export abstract class RootNode extends ShaderNode {}

/*

 __   __  _______  ______    ___   _______  _______  ___      _______  _______
|  | |  ||   _   ||    _ |  |   | |   _   ||  _    ||   |    |       ||       |
|  |_|  ||  |_|  ||   | ||  |   | |  |_|  || |_|   ||   |    |    ___||  _____|
|       ||       ||   |_||_ |   | |       ||       ||   |    |   |___ | |_____
|       ||       ||    __  ||   | |       ||  _   | |   |___ |    ___||_____  |
 |     | |   _   ||   |  | ||   | |   _   || |_|   ||       ||   |___  _____| |
  |___|  |__| |__||___|  |_||___| |__| |__||_______||_______||_______||_______|

*/

export class Variable<T extends GLSLType = any> {
  node: ShaderNode
  type: T
  value?: Value<T>
  globalName: string

  constructor(node: ShaderNode, type: T, value?: Value<T>) {
    this.node = node
    this.type = type
    this.value = value
    this.globalName = `var_${Math.floor(Math.random() * 1000000)}`
  }

  set(value: Value<T> | { outputs: { value: Value<T> } }) {
    if (value instanceof ShaderNode) {
      this.value = value.outputs.value as Value<T>
    } else {
      this.value = value as Value<T>
    }
  }

  renderValue(): string | undefined {
    /* TODO: add support for Vector3 and other Three types */

    if (this.value === undefined) {
      return undefined
    } else if (typeof this.value === "number") {
      /* TODO: use the better algorithm here that maintains precision */
      return this.value.toFixed(5)
    } else if (typeof this.value === "string") {
      return this.value
    } else if (this.value instanceof Variable) {
      return this.value.globalName
    } else {
      throw new Error("Could not render value: " + this.value)
    }
  }

  renderWithName(name: string, includeValue = true) {
    const value = includeValue ? this.renderValue() : undefined
    return `${this.type} ${name}${value ? ` = ${value}` : ""};`
  }

  render(includeValue = true) {
    return this.renderWithName(this.globalName, includeValue)
  }
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
