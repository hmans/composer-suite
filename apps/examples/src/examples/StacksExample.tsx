import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { compileShader, Factory, FloatNode, TimeNode } from "shadenfreude"
import { MeshStandardMaterial, ShaderMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const StackyMaster = Factory(() => ({}))

function useShader() {
  const time = TimeNode()

  const root = FloatNode()

  return compileShader(root)
}

export default function() {
  const [shaderProps, update] = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        />
      </mesh>
    </group>
  )
}
