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

export type MeshParticlesMaterial = CustomShaderMaterialImpl

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

    const { update, ...shader } = useMemo(() => {
      const { addModule, compile } = composableShader()

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

      return compile()
    }, [])

    useFrame(update)

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
