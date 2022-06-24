import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { compileShader } from "./shadenfreude/compilers"
import { float, node, plug, vec3 } from "./shadenfreude/factories"
import { masterNode, timeNode } from "./shadenfreude/nodes"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const colorValueNode = () =>
  node({
    name: "Color Value",
    outputs: {
      color: vec3("vec3(1.0, 0.5, 1.0)")
    }
  })

function useShader() {
  return useMemo(() => {
    const { time } = timeNode().outputs

    const wobble = node({
      name: "Wobble",
      inputs: { time: float() },
      outputs: { offset: vec3() },
      vertex: { body: `offset.x = sin(time * 2.5) * 5.0;` }
    })

    plug(time).into(wobble.inputs.time)

    const { color } = colorValueNode().outputs

    const root = masterNode({
      diffuseColor: color,
      offset: wobble.outputs.offset
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  useFrame(update)

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
