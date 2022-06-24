import { useMemo } from "react"
import { Color, MeshStandardMaterial } from "three"
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

const masterNode = (inputs: { diffuseColor?: Variable; offset?: Variable }) =>
  node({
    name: "Master Node",
    inputs: {
      diffuseColor: variable("vec3", inputs.diffuseColor),
      offset: variable("vec3", inputs.offset)
    },
    vertex: {
      header: "",
      body: "csm_Position += offset;"
    },
    fragment: {
      header: "",
      body: "csm_DiffuseColor.rgb = diffuseColor;"
    }
  })

function useShader() {
  return useMemo(() => {
    const { offset } = node({
      outputs: {
        offset: variable("vec3", "vec3(0.0, 0.0, 0.0)")
      }
    }).outputs

    const { color } = colorValueNode().outputs

    const root = masterNode({ diffuseColor: color, offset })

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
