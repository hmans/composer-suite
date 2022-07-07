import { Color } from "three"
import { assignment, concatenate } from "../lib/concatenator3000"
import { Bool, Float, Vec3 } from "../variables"
import { VertexPosition } from "./geometry"

export type CustomShaderMaterialMasterprops = {
  position?: Vec3
  diffuseColor?: Vec3
  alpha?: Float
}

export const CustomShaderMaterialMaster = ({
  diffuseColor = new Color(1, 1, 1),
  position = VertexPosition,
  alpha = 1
}: CustomShaderMaterialMasterprops) =>
  Bool(true, {
    title: "CustomShaderMaterial Master",

    inputs: {
      position,
      diffuseColor,
      alpha
    },

    vertexBody: concatenate(assignment("csm_Position", "position")),

    fragmentBody: concatenate(
      assignment("csm_DiffuseColor", "vec4(diffuseColor, alpha)")
    )
  })
