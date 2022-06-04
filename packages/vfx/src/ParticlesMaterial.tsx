import { forwardRef } from "react"
import { AddEquation, CustomBlending, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import * as shader from "./shader"

/*
This is a custom material that is derived from MeshStandardMaterial,
but with our custom vertex and fragment shader code injected.
This is extremely and very WIP, since not all mesh particles will be using
this kind of material.
*/

export const ParticlesMaterial = forwardRef<CustomShaderMaterialImpl, any>(
  (props, ref) => {
    return (
      <CustomShaderMaterial
        ref={ref}
        baseMaterial={MeshStandardMaterial}
        uniforms={{ u_time: { value: 0 } }}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        transparent
        blending={CustomBlending}
        blendEquation={AddEquation}
        depthTest={true}
        depthWrite={true}
        {...props}
      />
    )
  }
)
