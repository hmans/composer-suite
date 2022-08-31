import { Node } from "@react-three/fiber"
import React, { forwardRef } from "react"
import {
  IUniform,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshDistanceMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  RGBADepthPacking
} from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

export type MaterialConstructor<T extends THREE.Material> = { new (...args: any[]): T }

export type MaterialProps<T extends THREE.Material> = Node<T, MaterialConstructor<T>> & {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, IUniform>
}

const makeMaterialComponent = <T extends THREE.Material>(
  ctor: MaterialConstructor<T>,
  defaultProps?: MaterialProps<T>
) =>
  forwardRef<CustomShaderMaterialImpl, MaterialProps<T>>((props, ref) => {
    /* We still need to ts-ignore the next line, because something between
    R3F's and CSM's props typings appears to be deeply incompatible. */

    return (
      // @ts-ignore
      <CustomShaderMaterial baseMaterial={ctor} {...defaultProps} {...props} ref={ref} />
    )
  })

export const Custom = {
  MeshBasicMaterial: makeMaterialComponent(MeshBasicMaterial),
  MeshDepthMaterial: makeMaterialComponent(MeshDepthMaterial, {
    attach: "customDepthMaterial",
    depthPacking: RGBADepthPacking
  }),
  MeshDistanceMaterial: makeMaterialComponent(MeshDistanceMaterial, {
    attach: "customDistanceMaterial"
  }),
  MeshLambertMaterial: makeMaterialComponent(MeshLambertMaterial),
  MeshMatapMaterial: makeMaterialComponent(MeshMatcapMaterial),
  MeshNormalMaterial: makeMaterialComponent(MeshNormalMaterial),
  MeshPhongMaterial: makeMaterialComponent(MeshPhongMaterial),
  MeshPhysicalMaterial: makeMaterialComponent(MeshPhysicalMaterial),
  MeshStandardMaterial: makeMaterialComponent(MeshStandardMaterial),
  MeshToonMaterial: makeMaterialComponent(MeshToonMaterial)
}
