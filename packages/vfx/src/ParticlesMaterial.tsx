import React, { forwardRef, useMemo } from "react"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import * as shader from "./shader"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(({ billboard = false, ...props }, ref) => {
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0
      },
      u_billboard: { value: billboard }
    }),
    []
  )

  return (
    <CustomShaderMaterial
      ref={ref}
      uniforms={uniforms}
      blending={CustomBlending}
      blendEquation={AddEquation}
      depthTest={true}
      depthWrite={false}
      {...shader}
      {...props}
    />
  )
})
