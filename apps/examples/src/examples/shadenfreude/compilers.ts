import { ShaderNode } from "./types"

export function compileShaderNode(node: ShaderNode) {
  const vertexShader = `
    ${node.vertexHeader}

    void main() {
      ${node.vertexBody}
    }`

  const fragmentShader = `
    ${node.fragmentHeader}

    void main() {
      ${node.fragmentBody}
    }`

  const uniforms = {}

  return { vertexShader, fragmentShader, uniforms }
}
