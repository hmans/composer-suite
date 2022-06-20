import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending, DepthTexture } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { composableShader, modules } from "../shaders/"

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

    const shader = useMemo(() => {
      const { addModule, compile } = composableShader()

      addModule(modules.easings())
      addModule(modules.time())
      addModule(modules.lifetime())
      billboard && addModule(modules.billboarding())
      addModule(modules.scale(scaleFunction))
      addModule(modules.movement())
      addModule(modules.colors(colorFunction))
      softness && addModule(modules.softparticles(softness, softnessFunction))

      return compile()
    }, [])

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
