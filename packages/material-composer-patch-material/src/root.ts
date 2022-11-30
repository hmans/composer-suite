import { $, Input, Root } from "@shader-composer/core"

export type PatchedMaterialRootProps = {
  position?: Input<"vec3">
  normal?: Input<"vec3">
  color?: Input<"vec3">
  emissiveColor?: Input<"vec3">
  alpha?: Input<"float">
  roughness?: Input<"float">
  metalness?: Input<"float">
}

export const PatchedMaterialRoot = ({
  position,
  normal,
  color,
  emissiveColor,
  roughness,
  metalness,
  alpha
}: PatchedMaterialRootProps = {}) =>
  Root({
    name: "PatchedMaterial Root",

    vertex: {
      body: $`
        ${position !== undefined ? $`patched_Position.xyz = ${position};` : ""}
        ${normal !== undefined ? $`patched_Normal = ${normal};` : ""}
      `
    },

    fragment: {
      body: $`
        ${alpha !== undefined ? $`patched_Alpha = ${alpha};` : ""}
        ${color !== undefined ? $`patched_Color = ${color};` : ""}
        ${
          emissiveColor !== undefined
            ? $`patched_Emissive = ${emissiveColor};`
            : ""
        }

        #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
          ${roughness !== undefined ? $`patched_Roughness = ${roughness};` : ""}
          ${metalness !== undefined ? $`patched_Metalness = ${metalness};` : ""}
        #endif
      `
    }
  })
