import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { DepthTexture } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { ComposedShader, composableShader, modules } from "../shaders/"

export type MeshParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
  depthTexture?: DepthTexture
}

export type MeshParticlesMaterial = CustomShaderMaterialImpl & {
  __vfx: {
    composedShader: ComposedShader
  }
}

export const MeshParticlesMaterial = forwardRef<
  MeshParticlesMaterial,
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
    const material = useRef<MeshParticlesMaterial>(null!)

    const composedShader = useMemo(() => {
      const { addModule, compose } = composableShader()

      /* The Basics */
      addModule(modules.time())
      softness && addModule(modules.resolution())
      softness && addModule(modules.depthTexture(depthTexture!))
      addModule(modules.easings())

      /* The Specifics */
      addModule(modules.lifetime())
      billboard && addModule(modules.billboarding())
      addModule(modules.scale(scaleFunction))
      addModule(modules.movement())
      addModule(modules.colors(colorFunction))
      softness && addModule(modules.softparticles(softness, softnessFunction))

      return compose()
    }, [])

    useLayoutEffect(() => {
      material.current.__vfx = { composedShader }
    }, [])

    const { update, ...shader } = composedShader

    useFrame(update)

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        {...shader}
        {...props}
      />
    )
  }
)
