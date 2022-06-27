import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  BlendNode,
  ColorNode,
  compileShader,
  CSMMasterNode,
  FresnelNode,
  MultiplyNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {
    const baseColor = ColorNode({
      color: new Color("#800")
    })

    const highlight = ColorNode({
      color: new Color(2, 2, 2)
    })

    const fresnel = MultiplyNode({
      a: highlight,
      b: FresnelNode()
    })

    const diffuseColor = BlendNode({
      a: baseColor,
      b: fresnel,
      opacity: 1
    })

    const root = CSMMasterNode({
      diffuseColor
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()

  // console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} />
}

export default function() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <MyMaterial baseMaterial={MeshStandardMaterial}></MyMaterial>
      </mesh>
    </group>
  )
}
