import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { compileShader, FloatNode, TimeNode } from "shadenfreude"
import { ShaderMaterial } from "three"

function useShader() {
  const time = TimeNode()

  const root = FloatNode()

  return compileShader(root)
}

export default function() {
  const [shaderProps, update] = useShader()
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <shaderMaterial ref={material} {...shaderProps} />

        {/* <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        /> */}
      </mesh>
    </group>
  )
}
