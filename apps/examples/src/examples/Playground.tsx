import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  AddNode,
  BlendNode,
  compileShader,
  CSMMasterNode,
  float,
  FloatValueNode,
  FresnelNode,
  nodeFactory,
  TimeNode,
  Value,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const ColorNode = nodeFactory<{ color?: Value<"vec3"> }>(
  ({ color = new Color(1.0, 1.0, 1.0) }) => ({
    name: "Constant Color Value",
    outputs: {
      value: vec3(color)
    }
  })
)

const FloatNode = nodeFactory<{ a?: Value<"float"> }>(({ a = 1 }) => ({
  name: "Constant Float Value",
  outputs: {
    value: float(a)
  }
}))

const WobbleNode = nodeFactory<{
  amplitude?: Value<"float">
  frequency?: Value<"float">
  time?: Value<"float">
}>(({ amplitude = 1, frequency = 1, time }) => ({
  name: "Wobble",
  inputs: {
    amplitude: float(amplitude),
    frequency: float(frequency),
    time: float(time)
  },
  outputs: { value: vec3() },
  vertex: { body: `value.x = sin(time * frequency) * amplitude;` }
}))

function useShader() {
  return useMemo(() => {
    const root = CSMMasterNode({
      diffuseColor: BlendNode({
        a: ColorNode({ color: new Color("#dd8833") }).value,
        b: FresnelNode().value,
        opacity: FloatValueNode(1).value
      }).value,

      position: AddNode(
        VertexPositionNode().value,

        WobbleNode({
          time: TimeNode().value,
          amplitude: FloatNode({ a: 3 }).value,
          frequency: FloatNode({ a: 10 }).value
        }).value
      )
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()

  // console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

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
