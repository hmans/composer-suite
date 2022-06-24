import { ShaderNode } from "./types"

type Program = "vertex" | "fragment"

function compileHeader(node: ShaderNode, program: Program): string {
  return `
    ${node[program].header}
  `
}

function compileBody(node: ShaderNode, program: Program): string {
  return `
    ${node[program].body}
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
