import { forwardRef } from "react"
import { AddEquation, CustomBlending, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import * as shader from "./shader"

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
        depthWrite={false}
        {...props}
      />
    )
  }
)
