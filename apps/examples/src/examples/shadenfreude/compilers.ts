import { ShaderNode } from "./types"

export function compileShader(root: ShaderNode) {
  const vertexShader = `
    /*** VERTEX SHADER ***/

    ${root.vertexHeader}

    void main() {
      ${root.vertexBody}
    }`

  const fragmentShader = `
    /*** FRAGMENT SHADER ***/

    ${root.fragmentHeader}

    void main() {
      ${root.fragmentBody}
    }`

  const uniforms = {}

  return { vertexShader, fragmentShader, uniforms }
}
