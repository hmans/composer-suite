import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  BlendNode,
  ColorNode,
  compileShader,
  ComposeNode,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  Parameter,
  ShaderMaterialMasterNode,
  TimeNode,
  UVNode,
  vec2,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial, ShaderMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function NoiseExample() {
  const shaderProps = useShader(() => {
    return CustomShaderMaterialMasterNode()
  })

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
        />
      </mesh>
    </group>
  )
}
