import { Color } from "three"
import { expr } from "../expressions"
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

    vertexBody: expr`moo`,

    fragmentBody: expr`quack`
  })
