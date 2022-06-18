import React, { forwardRef, useMemo } from "react"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shader"

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(({ billboard = false, ...props }, ref) => {
  const shader = useMemo(
    () =>
      createShader({
        billboard,
        scaleFunction: "smoothstep(0.0, 1.0, sin(v_progress * PI))"
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
