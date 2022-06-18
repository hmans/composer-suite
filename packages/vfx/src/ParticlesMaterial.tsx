import { useDepthBuffer } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import React, { forwardRef, useEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shaders/shader"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  soft?: boolean
  scaleFunction?: string
  colorFunction?: string
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(
  (
    { billboard = false, soft = false, scaleFunction, colorFunction, ...props },
    ref
  ) => {
    const material = useRef<CustomShaderMaterialImpl>(null!)

    const shader = useMemo(
      () =>
        createShader({
          billboard,
          soft,
          scaleFunction,
          colorFunction
        }),
      []
    )

    if (soft) {
      const { camera } = useThree()

      const depthBuffer = useDepthBuffer()

      useEffect(() => {
        material.current.uniforms.u_depth.value = depthBuffer
        material.current.uniforms.u_cameraNear.value = camera.near
        material.current.uniforms.u_cameraFar.value = camera.far
        // material.current.uniforms.u_resolution.value = [256, 256]
      }, [depthBuffer])
    }

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        blending={CustomBlending}
        blendEquation={AddEquation}
        depthTest={true}
        depthWrite={false}
        {...shader}
        {...props}
      />
    )
  }
)
