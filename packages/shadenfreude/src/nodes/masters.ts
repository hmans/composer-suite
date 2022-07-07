import { Color } from "three"
import { assignment, concatenate } from "../lib/concatenator3000"
import { Value, Bool, Vec3 } from "../variables"
import { VertexPosition } from "./geometry"

export type CustomShaderMaterialMasterprops = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
}

export const CustomShaderMaterialMaster = ({
  diffuseColor = new Color(1, 1, 1),
  position = VertexPosition
}: CustomShaderMaterialMasterprops) =>
  Bool(true, {
    title: "CustomShaderMaterial Master",

    inputs: {
      position,
      diffuseColor
    },

    vertexBody: concatenate(assignment("csm_Position", "position")),

    fragmentBody: concatenate(
      assignment("csm_DiffuseColor", "vec4(diffuseColor, 1.0)")
    )
  })
