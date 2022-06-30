import { node } from "../src/shadenfreude"

describe("node", () => {
  it("creates a shader node", () => {
    const n = node({ name: "A Blank Shader Node" })
    expect(n).toEqual({ name: "A Blank Shader Node" })
  })
})
