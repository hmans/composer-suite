import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { compileShader } from "./shadenfreude/compilers"
import { float, node, vec3 } from "./shadenfreude/factories"
import {
  add,
  floatValueNode,
  fresnelNode,
  masterNode,
  mix,
  operator,
  timeNode,
  vertexPositionNode
} from "./shadenfreude/nodes"
import { Variable } from "./shadenfreude/types"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const colorValueNode = () =>
  node({
    name: "Color Value",
    outputs: {
      color: vec3("vec3(0.5, 0.3, 0.2)")
    }
  })

const wobble = (inputs?: { time?: Variable }) =>
  node({
    name: "Wobble",
    inputs: { time: float(inputs?.time) },
    outputs: { offset: vec3() },
    vertex: { body: `offset.x = sin(time * 2.5) * 5.0;` }
  })

function useShader() {
  return useMemo(() => {
    const { time } = timeNode().outputs

    const root = masterNode({
      diffuseColor: mix(
        fresnelNode().outputs.fresnel,
        colorValueNode().outputs.color,
        floatValueNode(0.5).outputs.value
      ),

      position: add(
        wobble({ time }).outputs.offset,
        vertexPositionNode().outputs.position
      )
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
        <sphereGeometry args={[8]} />

        <MyMaterial baseMaterial={MeshStandardMaterial}></MyMaterial>
      </mesh>
    </group>
  )
}
