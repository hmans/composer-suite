import { assignment } from "../lib/concatenator3000"
import { Value, bool } from "../variables"

export type CustomShaderMaterialMasterprops = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
}

export const CustomShaderMaterialMaster = (
  inputs: CustomShaderMaterialMasterprops
) =>
  bool(true, {
    title: "Master",
    inputs,
    vertexBody: assignment("csm_Position", "position"),
    fragmentBody: assignment("csm_DiffuseColor", "vec4(diffuseColor, 1.0)")
  })
