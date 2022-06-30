import { float, node } from "../src/shadenfreude"

describe("node", () => {
  it("creates a shader node", () => {
    const n = node({ name: "A Blank Shader Node" })
    expect(n).toEqual({ name: "A Blank Shader Node" })
  })

  it("assigns the node to its input and output variables", () => {
    const n = node({ inputs: { a: float() }, outputs: { value: float() } })
    expect(n.inputs.a.node).toBe(n)
    expect(n.outputs.value.node).toBe(n)
  })
})
