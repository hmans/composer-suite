import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  AddNode,
  BlendNode,
  compileShader,
  float,
  FloatValueNode,
  FresnelNode,
  MasterNode,
  node,
  TimeNode,
  Variable,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const ColorValueNode = () =>
  node({
    name: "Color Value",
    outputs: {
      value: vec3(new Vector3(1, 0.6, 0.1))
    }
  })

const WobbleNode = (inputs?: { time?: Variable }) =>
  node({
    name: "Wobble",
    inputs: { time: float(inputs?.time) },
    outputs: { value: vec3() },
    vertex: { body: `value.x = sin(time * 2.5) * 5.0;` }
  })

function useShader() {
  return useMemo(() => {
    const root = MasterNode({
      diffuseColor: BlendNode({
        a: ColorValueNode().value,
        b: FresnelNode().value,
        opacity: FloatValueNode(1).value
      }).value,

      position: AddNode(
        VertexPositionNode().value,
        WobbleNode({ time: TimeNode().outputs.value }).value
      )
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
