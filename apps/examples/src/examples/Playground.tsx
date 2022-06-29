import { useMemo, useRef } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {}, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  // const { update, ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  // console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  // useFrame(update)

  return <CustomShaderMaterial {...props} ref={material} />
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
