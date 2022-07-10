import { Color } from "three"
import { code } from "../expressions"
import { Bool, Value } from "../node"
import { VertexPosition } from "./geometry"

export type CustomShaderMaterialMasterprops = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
  alpha?: Value<"float">
}

export const CustomShaderMaterialMaster = ({
  diffuseColor = new Color(1, 1, 1),
  position = VertexPosition,
  alpha = 1
}: CustomShaderMaterialMasterprops = {}) =>
  Bool(true, {
    title: "CustomShaderMaterial Master",
    vertexBody: code`csm_Position = ${position};`,
    fragmentBody: code`csm_DiffuseColor = vec4(${diffuseColor}, ${alpha});`
  })
