import { Color } from "three"
import { expr } from "../expressions"
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
}: CustomShaderMaterialMasterprops = {}) =>
  Bool(true, {
    title: "CustomShaderMaterial Master",
    vertexBody: expr`csm_Position = ${position};`,
    fragmentBody: expr`csm_DiffuseColor = vec4(${diffuseColor}, ${alpha});`
  })
