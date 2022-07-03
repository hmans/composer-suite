import { useControls } from "leva"
import { useRef } from "react"
import {
  BlendNode,
  ColorNode,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  MultiplyNode,
  ShaderNode,
  TimeNode,
  UniformNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { useShader } from "./useShader"

const ScaleWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Scale with Time",

    inputs: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(0.5),
      time: float(TimeNode())
    },

    outputs: {
      value: vec3("inputs.a")
    },

    vertex: {
      body: `outputs.value.${axis} *= (1.0 + sin(inputs.time * inputs.frequency) * inputs.amplitude);`
    }
  }))

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  inputs: {
    a: vec3(),

    frequency: float(1),
    amplitude: float(0.3),
    time: float(TimeNode())
  },
  outputs: {
    value: vec3("inputs.a")
  },
  vertex: {
    body: `outputs.value.x *= (
      1.0 + sin(inputs.time * inputs.frequency
        + position.y * 0.3 * inputs.frequency
        + position.x * 0.3 * inputs.frequency) * inputs.amplitude);`
  }
}))

const MoveWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Move with Time",
    inputs: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(1),
      time: float(TimeNode())
    },
    outputs: {
      value: vec3("inputs.a")
    },
    vertex: {
      body: `outputs.value.${axis} += sin(inputs.time * inputs.frequency) * inputs.amplitude;`
    }
  }))

export default function StacksExample() {
  const { speed, intensity, color, fresnelIntensity } = useControls(
    "Uniforms",
    {
      speed: { value: 1, min: 0, max: 2 },
      intensity: { value: 1, min: 0, max: 2 },
      color: "#3dd",
      fresnelIntensity: { value: 2, min: 0, max: 5 }
    }
  )

  const shader = useShader(() => {
    const speedUniform = UniformNode({ type: "float", name: "u_speed" })
    const intensityUniform = UniformNode({ type: "float", name: "u_intensity" })
    const colorUniform = UniformNode({ type: "vec3", name: "u_color" })
    const fresnelIntensityUniform = UniformNode({
      type: "float",
      name: "u_fresnelIntensity"
    })

    const root = CustomShaderMaterialMasterNode({
      position: ShaderNode({
        name: "Animation Stack",

        outputs: {
          value: vec3(VertexPositionNode())
        },

        filters: [
          SqueezeWithTime({
            frequency: MultiplyNode({ a: speedUniform, b: 0.3 }),
            amplitude: MultiplyNode({ a: intensityUniform, b: 0.5 })
          }),
          ScaleWithTime("x")({
            frequency: MultiplyNode({ a: speedUniform, b: 0.3 }),
            amplitude: MultiplyNode({ a: intensityUniform, b: 0.5 })
          }),
          ScaleWithTime("y")({
            frequency: MultiplyNode({ a: speedUniform, b: 0.2 }),
            amplitude: MultiplyNode({ a: intensityUniform, b: 0.5 })
          }),
          ScaleWithTime("z")({
            frequency: MultiplyNode({ a: speedUniform, b: 0.1 }),
            amplitude: MultiplyNode({ a: intensityUniform, b: 0.5 })
          }),
          MoveWithTime("x")({
            frequency: speedUniform,
            amplitude: MultiplyNode({ a: intensityUniform, b: 2 })
          }),
          MoveWithTime("y")({
            frequency: speedUniform,
            amplitude: MultiplyNode({ a: intensityUniform, b: 1 })
          }),
          MoveWithTime("z")({
            frequency: speedUniform,
            amplitude: MultiplyNode({ a: intensityUniform, b: 2 })
          })
        ]
      }),

      diffuseColor: ShaderNode({
        name: "Color Stack",
        outputs: {
          value: vec3(colorUniform)
        },
        filters: [
          BlendNode({
            mode: "softlight",
            opacity: 1,
            a: vec3(),
            b: MultiplyNode({
              a: MultiplyNode({
                a: ColorNode({ a: new Color(2, 2, 2) }),
                b: fresnelIntensityUniform
              }),
              b: FresnelNode()
            })
          })
        ]
      })
    })

    return root
  }, [])

  const material = useRef<CustomShaderMaterialImpl>(null!)

  const { uniforms, ...restShader } = shader

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={{
            ...uniforms,
            u_speed: { value: speed },
            u_intensity: { value: intensity },
            u_color: { value: new Color(color) },
            u_fresnelIntensity: { value: fresnelIntensity }
          }}
          {...restShader}
          ref={material}
        />
      </mesh>
    </group>
  )
}
