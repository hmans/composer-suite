import { $ } from "../expressions"
import { Input } from "../units"
import { VertexPosition } from "./variables"
import { Master, Vec3 } from "./values"

export type ShaderMaterialMasterProps = {
  color?: Input<"vec3">
  alpha?: Input<"float">
  position?: Input<"vec3">
}

export const ShaderMaterialMaster = ({
  color = Vec3([1, 0, 0]),
  alpha = 1,
  position = VertexPosition
}: ShaderMaterialMasterProps = {}) =>
  Master({
    name: "ShaderMaterial Master",

    vertex: {
      body: $`
				gl_Position = projectionMatrix * modelViewMatrix * vec4(${position}, 1.0);
			`
    },

    fragment: {
      body: $`
				gl_FragColor = vec4(${color}, ${alpha});
			`
    }
  })

export type CustomShaderMaterialMasterProps = {
  position?: Input<"vec3">
  normal?: Input<"vec3">
  diffuseColor?: Input<"vec3">
  emissiveColor?: Input<"vec3">
  fragColor?: Input<"vec3">
  alpha?: Input<"float">
  roughness?: Input<"float">
  metalness?: Input<"float">
}

export const CustomShaderMaterialMaster = ({
  position,
  normal,
  diffuseColor,
  emissiveColor,
  fragColor,
  roughness,
  metalness,
  alpha
}: CustomShaderMaterialMasterProps = {}) =>
  Master({
    name: "CustomShaderMaterial Master",

    vertex: {
      body: $`
				${position !== undefined ? $`csm_Position.xyz = ${position};` : ""}
				${normal !== undefined ? $`csm_Normal = ${normal};` : ""}
			`
    },

    fragment: {
      body: $`
  			${alpha !== undefined ? $`csm_DiffuseColor.a = ${alpha};` : ""}
				${diffuseColor !== undefined ? $`csm_DiffuseColor.rgb = ${diffuseColor};` : ""}
				${emissiveColor !== undefined ? $`csm_Emissive = ${emissiveColor};` : ""}
				${
          fragColor !== undefined
            ? $`csm_FragColor = vec4(${fragColor}, ${alpha});`
            : ""
        }

        #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
          ${roughness !== undefined ? $`csm_Roughness = ${roughness};` : ""}
          ${metalness !== undefined ? $`csm_Metalness = ${metalness};` : ""}
        #endif
			`
    }
  })
