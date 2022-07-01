import { Color } from "three"
import { Factory, float, vec3 } from "../shadenfreude"
import { GeometryPositionNode, GeometryNormalNode } from "./geometry"

export const ShaderMaterialMasterNode = Factory(() => ({
  name: "ShaderMaterial Master",

  in: {
    position: vec3("position"),
    color: vec3(new Color(1, 1, 1)),
    opacity: float(1)
  },

  vertex: {
    body: `
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(in_position, 1.0);
    `
  },

  fragment: {
    body: `
      gl_FragColor = vec4(in_color, in_opacity);
    `
  }
}))

export const CustomShaderMaterialMasterNode = Factory(() => ({
  name: "CustomShaderMaterial Master",
  in: {
    position: vec3(GeometryPositionNode()),
    normal: vec3(GeometryNormalNode()),
    diffuseColor: vec3(new Color(1, 1, 1)),
    emissiveColor: vec3(new Color(0, 0, 0))
  },
  vertex: {
    body: `
      csm_Position = in_position;
      csm_Normal = in_normal;
    `
  },
  fragment: {
    body: `
      csm_DiffuseColor.rgb = in_diffuseColor;
      csm_Emissive.rgb = in_emissiveColor;
    `
  }
}))
