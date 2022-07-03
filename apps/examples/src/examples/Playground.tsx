import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  ColorNode,
  compileShader,
  ComposeNode,
  Factory,
  float,
  FresnelNode,
  VertexPositionNode,
  UVNode,
  MultiplyNode,
  Parameter,
  Program,
  ShaderMaterialMasterNode,
  TimeNode,
  vec2,
  vec3,
  SoftlightBlendNode
} from "shadenfreude"
import { Color, ShaderMaterial } from "three"

const WobbleNode = Factory(() => ({
  name: "Wobble",

  in: {
    /** The time offset */
    time: float(),

    /** How fast to wobble */
    frequency: float(1),

    /** How hard to wobble */
    amplitude: float(1)
  },

  out: {
    /** The wobble value */
    value: float("sin(in_time * in_frequency) * in_amplitude")
  }
}))

type WobbleProps = {
  frequency?: number
  amplitude?: number
  time?: Parameter<"float">
}

const WobbleAnimation = ({
  frequency = 1,
  amplitude = 1,
  time = TimeNode()
}: WobbleProps) =>
  ComposeNode({
    x: WobbleNode({ time, frequency: 8 * frequency, amplitude }),
    y: WobbleNode({ time, frequency: 5 * frequency, amplitude }),
    z: WobbleNode({ time, frequency: 3 * frequency, amplitude })
  }).out.vec3

const Squeezed = Factory(() => ({
  in: {
    position: vec3(),
    time: float(),
    uv: vec2(UVNode())
  },
  out: {
    value: vec3(
      `vec3(
        in_position.x * (1.0 + sin(in_time * 2.0 + in_uv.y * 13.0) * 0.3),
        in_position.y * (1.0 + cos(in_time * 2.3 + in_uv.y * 11.0) * 0.2),
        in_position.z * (1.0 + sin(in_time * 2.0 + in_uv.y * 13.0) * 0.1))`
    )
  }
}))

function useShader() {
  return useMemo(() => {
    const time = TimeNode()

    const fresnel = MultiplyNode({
      a: ColorNode({ a: new Color("white") }),
      b: FresnelNode({ power: 2, factor: 1, bias: 0, intensity: 2 })
    })

    const root = ShaderMaterialMasterNode({
      position: AddNode({
        a: Squeezed({ position: VertexPositionNode(), time }),
        b: WobbleAnimation({ frequency: 0.2, amplitude: 3.5, time })
      }),

      color: SoftlightBlendNode({
        a: ColorNode({ a: new Color("#c42") }),
        b: fresnel
      })
    })

    return compileShader(root)
  }, [])
}

export default function Playground() {
  const [shaderProps, update] = useShader()
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <shaderMaterial ref={material} {...shaderProps} />

        {/* <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        /> */}
      </mesh>
    </group>
  )
}
