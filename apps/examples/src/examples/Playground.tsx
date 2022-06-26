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
      color: vec3(new Vector3(1, 0.6, 0.1))
    }
  })

const WobbleNode = (inputs?: { time?: Variable }) =>
  node({
    name: "Wobble",
    inputs: { time: float(inputs?.time) },
    outputs: { offset: vec3() },
    vertex: { body: `offset.x = sin(time * 2.5) * 5.0;` }
  })

function useShader() {
  return useMemo(() => {
    const { time } = TimeNode().outputs

    const root = MasterNode({
      diffuseColor: BlendNode({
        a: ColorValueNode().outputs.color,
        b: FresnelNode().outputs.fresnel,
        opacity: FloatValueNode(1).outputs.value
      }).outputs.result,

      position: AddNode(
        WobbleNode({ time }).outputs.offset,
        VertexPositionNode().outputs.position
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
