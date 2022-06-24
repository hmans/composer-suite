import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { compileShader } from "./shadenfreude/compilers"
import { node, variable } from "./shadenfreude/factories"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {
    const root = node({
      name: "Test",
      inputs: {
        color: variable("vec3", "vec3(1.0, 0.0, 0.5)")
      },
      outputs: {
        foo: variable("float")
      },
      fragment: {
        header: "",
        body: "csm_DiffuseColor.rgb = color;"
      }
    })

    return compileShader(root)
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
