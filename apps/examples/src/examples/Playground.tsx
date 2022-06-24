import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { compileShader } from "./shadenfreude/compilers"
import { node, variable } from "./shadenfreude/factories"
import { Variable } from "./shadenfreude/types"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const colorValueNode = () =>
  node({
    name: "Color Value",
    outputs: {
      color: variable("vec3", "vec3(1.0, 0.5, 1.0)")
    }
  })

const masterNode = (inputs: { color: Variable }) =>
  node({
    name: "Test",
    inputs: {
      color: variable("vec3", inputs.color)
    },
    outputs: {
      foo: variable("float")
    },
    fragment: {
      header: "",
      body: "csm_DiffuseColor.rgb = color;"
    }
  })

function useShader() {
  return useMemo(() => {
    const { color } = colorValueNode().outputs

    const root = masterNode({ color })

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
