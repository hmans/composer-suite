import { ShaderNode } from "./types"

type Program = "vertex" | "fragment"

function nodeTitle(node: ShaderNode) {
  return `/** Node: ${node.name} **/`
}

function compileHeader(node: ShaderNode, program: Program): string {
  return `
    ${nodeTitle(node)}
    ${node[program].header}
  `
}

function compileBody(node: ShaderNode, program: Program): string {
  return `
    ${nodeTitle(node)}
    {
      ${node[program].body}
    }
  `
}

export function compileShader(root: ShaderNode) {
  const vertexShader = `
    /*** VERTEX SHADER ***/

    ${compileHeader(root, "vertex")}

    void main() {
      ${compileBody(root, "vertex")}
    }`

  const fragmentShader = `
    /*** FRAGMENT SHADER ***/

    ${compileHeader(root, "fragment")}

    void main() {
      ${compileBody(root, "fragment")}
    }`

  const uniforms = {}

  return { vertexShader, fragmentShader, uniforms }
}
