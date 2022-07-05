import { Color } from "three"
import { assignment } from "../lib/concatenator3000"
import { Factory, float, vec3 } from "../shadenfreude"
import { VertexPositionNode, VertexNormalNode } from "./geometry"

export const ShaderMaterialMasterNode = Factory(() => ({
  name: "ShaderMaterial Master",

  inputs: {
    position: vec3(VertexPositionNode()),
    color: vec3(new Color(1, 1, 1)),
    alpha: float(1)
  },

  vertex: {
    body: assignment(
      "gl_Position",
      "projectionMatrix * viewMatrix * modelMatrix * vec4(inputs.position, 1.0)"
    )
  },

  fragment: {
    body: assignment("gl_FragColor", "vec4(inputs.color, inputs.alpha)")
  }
}))

/**
 * A master node for use with three-custom-shader-material.
 */
export const CustomShaderMaterialMasterNode = Factory(() => ({
  name: "CustomShaderMaterial Master",

  inputs: {
    /** Position of the vertex. */
    position: vec3(VertexPositionNode()),

    /** Normal of the vertex. */
    normal: vec3(VertexNormalNode()),

    /** Diffuse color of the fragment. */
    diffuseColor: vec3(new Color(1, 1, 1)),

    /** Emissive color of the fragment. */
    emissiveColor: vec3(new Color(0, 0, 0))
  },

  vertex: {
    body: [
      assignment("csm_Position", "inputs.position"),
      assignment("csm_Normal", "inputs.normal")
    ]
  },

  fragment: {
    body: [
      assignment("csm_DiffuseColor.rgb", "inputs.diffuseColor"),
      assignment("csm_Emissive.rgb", "inputs.emissiveColor")
    ]
  }
}))
