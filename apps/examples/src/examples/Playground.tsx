import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  BlendNode,
  compileShader,
  CSMMasterNode,
  float,
  FresnelNode,
  MultiplyNode,
  node,
  TimeNode,
  Value,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

type WobbleProps = {
  amplitude?: Value<"float">
  frequency?: Value<"float">
  x?: Value<"float">
}

const WobbleNode = ({ amplitude = 1, frequency = 1, x }: WobbleProps) =>
  node({
    name: "Wobble",
    inputs: {
      amplitude: float(amplitude),
      frequency: float(frequency),
      x: float(x)
    },
    outputs: { value: vec3() },
    vertex: { body: `value.x = sin(x * frequency) * amplitude;` }
  })

function useShader() {
  return useMemo(() => {
    const root = CSMMasterNode({
      diffuseColor: BlendNode({
        a: new Color("#dd8833"),
        b: MultiplyNode({
          a: new Color("#ffffff"),
          b: FresnelNode()
        }),
        opacity: 1
      }),

      position: AddNode({
        a: VertexPositionNode(),
        b: WobbleNode({
          x: TimeNode(),
          amplitude: 3,
          frequency: 10
        })
      })
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  // console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} ref={material} />
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
