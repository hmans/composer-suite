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
  nodeFactory,
  TimeNode,
  UniformNode,
  Value,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

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
    const timeUniform = UniformNode({
      name: "u_time",
      type: "float",
      initialValue: 0
    })

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
          x: TimeNode({
            source: timeUniform
          }),
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

  useFrame((_, dt) => {
    material.current.uniforms.u_time.value += dt
  })

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
