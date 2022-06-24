import { MeshStandardMaterial } from "three"
import { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterial from "three-custom-shader-material"
import { useMemo } from "react"
import { ShaderNode } from "./shadenfreude/types"
import { compileShaderNode } from "./shadenfreude/compilers"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {
    const node: ShaderNode = {
      name: "Test",
      vertexHeader: "",
      vertexBody: "",
      fragmentHeader: "",
      fragmentBody: "csm_DiffuseColor.rgb = vec3(1.0, 0.5, 0.0);"
    }

    return compileShaderNode(node)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const shaderProps = useShader()

  return <CustomShaderMaterial {...props} {...shaderProps} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />

        <MyMaterial
          color="red"
          baseMaterial={MeshStandardMaterial}
        ></MyMaterial>
      </mesh>
    </group>
  )
}
