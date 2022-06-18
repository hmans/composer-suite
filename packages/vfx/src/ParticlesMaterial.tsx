import React, { forwardRef, useMemo } from "react"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shaders/shader"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  scaleFunction?: string
  colorFunction?: string
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(({ billboard = false, scaleFunction, colorFunction, ...props }, ref) => {
  const shader = useMemo(
    () =>
      createShader({
        billboard,
        scaleFunction,
        colorFunction
      }),
    []
  )

  return (
    <CustomShaderMaterial
      ref={ref}
      blending={CustomBlending}
      blendEquation={AddEquation}
      depthTest={true}
      depthWrite={false}
      {...shader}
      {...props}
    />
  )
})
