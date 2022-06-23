import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { DepthTexture } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import {
  animateColors,
  animateMovement,
  animateScale,
  billboarding,
  provideEasingFunctions,
  provideLifetime,
  provideResolution,
  provideTime,
  softParticles
} from "../layers"
import provideDepthTexture from "../layers/provideDepthTexture"
import { combineShaders, compileShader, Shader } from "../shaders"

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
    shader: Shader
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

    const shader = useMemo(() => {
      const layers = [
        provideTime(),
        provideLifetime(),
        provideResolution(),
        provideEasingFunctions(),
        softness && provideDepthTexture(depthTexture!),
        billboard && billboarding(),
        animateScale(scaleFunction),
        animateMovement(),
        animateColors(colorFunction),
        softness && softParticles(softness, softnessFunction)
      ].filter((l) => l) as Shader[]

      return combineShaders(layers)
    }, [])

    const { update, ...attrs } = useMemo(() => compileShader(shader), [shader])

    useLayoutEffect(() => {
      material.current.__vfx = { shader }
    }, [])

    useFrame(update)

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        {...attrs}
        {...props}
      />
    )
  }
)
