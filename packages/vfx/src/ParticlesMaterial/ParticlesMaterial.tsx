import { forwardRef } from "react"
import { AddEquation, CustomBlending, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { iCSMProps } from "three-custom-shader-material/types"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import * as shader from "./shader"

/*
This is a custom material that is derived from MeshStandardMaterial,
but with our custom vertex and fragment shader code injected.
This is extremely and very WIP, since not all mesh particles will be using
this kind of material.
*/

type ParticlesMaterialProps = Omit<iCSMProps, "ref" | "baseMaterial">

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(({ transparent = false, ...props }, ref) => {
  return (
    <CustomShaderMaterial
      ref={ref}
      baseMaterial={MeshStandardMaterial}
      uniforms={{ u_time: { value: 0 } }}
      vertexShader={shader.vertexShader}
      fragmentShader={shader.fragmentShader}
      blending={CustomBlending}
      blendEquation={AddEquation}
      depthTest={true}
      transparent={transparent}
      {...props}
    />
  )
})
