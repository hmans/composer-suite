import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending, DepthTexture } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shader"

type MeshParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
  depthTexture?: DepthTexture
}

export const MeshParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  MeshParticlesMaterialProps
>(
  (
    {
      billboard = false,
      softness = 0,
      scaleFunction,
      colorFunction,
      softnessFunction,
      depthTexture,
      ...props
    },
    ref
  ) => {
    const material = useRef<CustomShaderMaterialImpl>(null!)

    const shader = useMemo(
      () =>
        createShader({
          billboard,
          softness,
          scaleFunction,
          colorFunction,
          softnessFunction
        }),
      []
    )

    useFrame(({ camera, size }) => {
      if (softness) {
        material.current.uniforms.u_depth.value = depthTexture
        material.current.uniforms.u_cameraNear.value = camera.near
        material.current.uniforms.u_cameraFar.value = camera.far
        material.current.uniforms.u_resolution.value = [size.width, size.height]
      }
    })

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        blending={CustomBlending}
        blendEquation={AddEquation}
        {...shader}
        {...props}
      />
    )
  }
)
