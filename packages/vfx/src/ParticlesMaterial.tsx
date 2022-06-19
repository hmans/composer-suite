import { useThree } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending, DepthTexture } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shaders/shader"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
  depthTexture?: DepthTexture
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
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

    const dpr = useThree((state) => state.viewport.dpr)
    const { width, height } = useThree((state) => state.size)

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

    if (softness) {
      const { camera, size } = useThree()

      useLayoutEffect(() => {
        console.log("Setting new uniforms")
        material.current.uniforms.u_depth.value = depthTexture
        material.current.uniforms.u_cameraNear.value = camera.near
        material.current.uniforms.u_cameraFar.value = camera.far

        // TODO: derive these from depthTexture
        material.current.uniforms.u_resolution.value = [size.width, size.height]
      }, [depthTexture, width, height, dpr, camera.near, camera.far])
    }

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
