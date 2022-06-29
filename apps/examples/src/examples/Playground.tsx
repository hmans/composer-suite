import { useMemo, useRef } from "react"
import { Compiler, float, ShaderNodeFactory } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const FloatNode: ShaderNodeFactory = () => ({
  name: "Float Value",
  vertex: {
    body: "csm_Position.x += 12.0;"
  },
  inputs: {
    a: float()
  }
})

const RootNode: ShaderNodeFactory = () => ({
  name: "Root Node",
  vertex: {
    body: "csm_Position.x += 12.0;"
  }
})

function useShader() {
  return useMemo(() => {
    const root = RootNode()
    return Compiler(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  // useFrame((_, dt) => update(dt))

  return <CustomShaderMaterial {...props} {...shaderProps} ref={material} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <MyMaterial baseMaterial={MeshStandardMaterial}></MyMaterial>
      </mesh>
    </group>
  )
}
