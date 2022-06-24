import { MeshStandardMaterial } from "three"
import { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterial from "three-custom-shader-material"
import { useMemo } from "react"
import { ShaderNode } from "./shadenfreude/types"
import { compileShader } from "./shadenfreude/compilers"
import { variable } from "./shadenfreude/factories"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {
    const node: ShaderNode = {
      name: "Test",
      inputs: {
        color: variable("vec3", "vec3(1.0, 0.0, 0.5)")
      },
      outputs: {
        foo: variable("float")
      },
      vertex: {
        header: "",
        body: ""
      },
      fragment: {
        header: "",
        body: "csm_DiffuseColor.rgb = color;"
      }
    }

    return compileShader(node)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const shaderProps = useShader()

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

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
