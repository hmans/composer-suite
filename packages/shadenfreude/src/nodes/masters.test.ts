import { Color } from "three"
import { compileShader } from "../compilers"
import { CustomShaderMaterialMaster } from "./masters"

describe("CustomShaderMaterialMaster", () => {
  it("renders code for CustomShaderMaterial", () => {
    const master = CustomShaderMaterialMaster({
      diffuseColor: new Color("hotpink")
    })

    const shader = compileShader(master)

    expect(shader.vertexShader).toMatchSnapshot()
    expect(shader.fragmentShader).toMatchSnapshot()
  })
})
