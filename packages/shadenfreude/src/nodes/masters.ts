import { Color } from "three"
import { code } from "../expressions"
import { Bool, Value } from "../tree"
import { VertexNormal, VertexPosition } from "./geometry"

export type CustomShaderMaterialMasterprops = {
  position?: Value<"vec3">
  normal?: Value<"vec3">
  diffuseColor?: Value<"vec3">
  alpha?: Value<"float">
}

export const CustomShaderMaterialMaster = ({
  diffuseColor = new Color(1, 1, 1),
  position = VertexPosition,
  normal = VertexNormal,
  alpha = 1
}: CustomShaderMaterialMasterprops = {}) =>
  Bool(true, {
    name: "CustomShaderMaterial Master",
    vertexBody: code`
      csm_Position = ${position};
      csm_Normal = ${normal};
    `,
    fragmentBody: code`
      csm_DiffuseColor = vec4(${diffuseColor}, ${alpha});
    `
  })
