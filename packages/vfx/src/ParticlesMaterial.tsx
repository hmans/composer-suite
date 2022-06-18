import { useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shaders/shader"
import { useDepthBuffer } from "./lib/useDepthBuffer"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(
  (
    { billboard = false, softness = 0, scaleFunction, colorFunction, ...props },
    ref
  ) => {
    const material = useRef<CustomShaderMaterialImpl>(null!)

    const { width, height } = useThree((state) => state.size)

    const shader = useMemo(
      () =>
        createShader({
          billboard,
          softness,
          scaleFunction,
          colorFunction
        }),
      []
    )

    if (softness) {
      const { camera } = useThree()

      const depthBuffer = useDepthBuffer()

      useEffect(() => {
        material.current.uniforms.u_depth.value = depthBuffer
        material.current.uniforms.u_cameraNear.value = camera.near
        material.current.uniforms.u_cameraFar.value = camera.far
        material.current.uniforms.u_resolution.value = [
          window.innerWidth,
          window.innerHeight
        ]
      }, [depthBuffer, width, height])
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
