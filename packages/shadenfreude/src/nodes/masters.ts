import { assignment, concatenate } from "../lib/concatenator3000"
import { Value, Bool } from "../variables"

export type CustomShaderMaterialMasterprops = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
}

export const CustomShaderMaterialMaster = (
  inputs: CustomShaderMaterialMasterprops
) =>
  Bool(true, {
    title: "CustomShaderMaterial Master",
    inputs,

    vertexBody: concatenate(
      inputs.position && assignment("csm_Position", "position")
    ),

    fragmentBody: concatenate(
      inputs.diffuseColor &&
        assignment("csm_DiffuseColor", "vec4(diffuseColor, 1.0)")
    )
  })
