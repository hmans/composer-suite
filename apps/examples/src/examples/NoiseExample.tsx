import { CustomShaderMaterialMasterNode } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function NoiseExample() {
  const shaderProps = useShader(() => {
    return CustomShaderMaterialMasterNode()
  })

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={5}>
      <mesh>
        <boxGeometry args={[20, 2, 20]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
        />
      </mesh>
    </group>
  )
}
