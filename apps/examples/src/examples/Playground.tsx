import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  AddNode,
  BlendNode,
  ColorNode,
  compileShader,
  CSMMasterNode,
  float,
  FloatNode,
  FresnelNode,
  nodeFactory,
  TimeNode,
  Value,
  vec3,
  VertexPositionNode,
  MultiplyNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const WobbleNode = nodeFactory<{
  amplitude?: Value<"float">
  frequency?: Value<"float">
  x?: Value<"float">
}>(({ amplitude = 1, frequency = 1, x }) => ({
  name: "Wobble",
  inputs: {
    amplitude: float(amplitude),
    frequency: float(frequency),
    x: float(x)
  },
  outputs: { value: vec3() },
  vertex: { body: `value.x = sin(x * frequency) * amplitude;` }
}))

function useShader() {
  return useMemo(() => {
    const root = CSMMasterNode({
      diffuseColor: BlendNode({
        a: new Color("#dd8833"),
        b: MultiplyNode({
          a: ColorNode({ color: new Color("#ffffff") }).value,
          b: FresnelNode().value
        }).value,
        opacity: FloatNode({ value: 1 }).value
      }).value,

      position: AddNode({
        a: VertexPositionNode().value,
        b: WobbleNode({
          x: TimeNode().value, // link to other nodes...
          amplitude: 3, // ...or just use normal values!
          frequency: 10
        }).value
      }).value
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
