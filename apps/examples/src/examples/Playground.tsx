import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  BlendNode,
  ColorNode,
  compileShader,
  ComposeNode,
  Factory,
  float,
  Parameter,
  ShaderMaterialMasterNode,
  ShaderNode,
  TimeNode,
  UVNode,
  ValueType,
  vec2,
  vec3
} from "shadenfreude"
import { Color, ShaderMaterial } from "three"
import { useShader } from "./useShader"

const WobbleNode = Factory(() => ({
  name: "Wobble",

  inputs: {
    /** The time offset */
    time: float(),

    /** How fast to wobble */
    frequency: float(1),

    /** How hard to wobble */
    amplitude: float(1)
  },

  outputs: {
    /** The wobble value */
    value: float("sin(inputs.time * inputs.frequency) * inputs.amplitude")
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
  }).outputs.vector3

const Squeezed = Factory(() => ({
  inputs: {
    position: vec3(),
    time: float(),
    uv: vec2(UVNode())
  },
  outputs: {
    value: vec3(
      `vec3(
        inputs.position.x * (1.0 + sin(inputs.time * 2.0 + inputs.uv.y * 13.0) * 0.3),
        inputs.position.y * (1.0 + cos(inputs.time * 2.3 + inputs.uv.y * 11.0) * 0.2),
        inputs.position.z * (1.0 + sin(inputs.time * 2.0 + inputs.uv.y * 13.0) * 0.1))`
    )
  }
}))

export default function Playground() {
  const shaderProps = useShader(() => {
    const colorA = ColorNode({ a: new Color("#f33") })
    const colorB = ColorNode({ a: new Color(0, 1, 0) })

    const AddColorLayer = Factory(() =>
      AddNode({
        a: vec3(), // eeeh
        b: colorB
      })
    )

    const colorStack = ShaderNode({
      name: "Color Stack",
      inputs: {
        color: vec3(colorA)
      },
      outputs: {
        value: vec3("inputs.color")
      },
      filters: [AddColorLayer()]
    })

    return ShaderMaterialMasterNode({
      color: colorStack
    })
  })
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

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
