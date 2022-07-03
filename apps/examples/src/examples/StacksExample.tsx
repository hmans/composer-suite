import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import {
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  MultiplyNode,
  Parameter,
  SoftlightBlendNode,
  StackNode,
  TimeNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const ScaleWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Scale with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(0.5),
      time: float(TimeNode())
    },
    out: {
      value: vec3("in_a")
    },
    vertex: {
      body: `out_value.${axis} *= (1.0 + sin(in_time * in_frequency) * in_amplitude);`
    }
  }))

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  in: {
    a: vec3(),

    frequency: float(1),
    amplitude: float(0.3),
    time: float(TimeNode())
  },
  out: {
    value: vec3("in_a")
  },
  vertex: {
    body: `out_value.x *= (
      1.0 + sin(in_time * in_frequency
        + position.y * 0.3 * in_frequency
        + position.x * 0.3 * in_frequency) * in_amplitude);`
  }
}))

const MoveWithTime = (axis = "xyz") =>
  Factory(() => ({
    name: "Move with Time",
    in: {
      a: vec3(),
      frequency: float(1),
      amplitude: float(1),
      time: float(TimeNode())
    },
    out: {
      value: vec3("in_a")
    },
    vertex: {
      body: `out_value.${axis} += sin(in_time * in_frequency) * in_amplitude;`
    }
  }))

function useShader() {
  const { speed, intensity, color, fresnelIntensity } = useControls("Wobble", {
    speed: { value: 1, min: 0, max: 10 },
    intensity: { value: 1, min: 0, max: 2 },
    color: "#3dd",
    fresnelIntensity: { value: 2, min: 0, max: 5 }
  })

  const AnimationStack = StackNode("vec3", "Animation Stack")
  const ColorStack = StackNode("vec3", "Color Stack")

  const root = CustomShaderMaterialMasterNode({
    position: AnimationStack(VertexPositionNode(), [
      SqueezeWithTime({ frequency: 0.1 * speed, amplitude: 0.5 * intensity }),
      ScaleWithTime("x")({
        frequency: 0.2 * speed,
        amplitude: 0.5 * intensity
      }),
      ScaleWithTime("y")({
        frequency: 0.1 * speed,
        amplitude: 0.5 * intensity
      }),
      ScaleWithTime("z")({
        frequency: 0.3 * speed,
        amplitude: 0.5 * intensity
      }),
      MoveWithTime("x")({ frequency: 0.8 * speed, amplitude: 2 * intensity }),
      MoveWithTime("y")({ frequency: 0.6 * speed, amplitude: 1 * intensity }),
      MoveWithTime("z")({ frequency: 0.3 * speed, amplitude: 2 * intensity })
    ]),

    diffuseColor: ColorStack(new Color(color), [
      SoftlightBlendNode({
        opacity: 0.8,
        b: MultiplyNode({
          a: new Color(1, 1, 1).multiplyScalar(fresnelIntensity) as Parameter<
            "vec3"
          >,
          b: FresnelNode()
        })
      })
    ])
  })

  const [shader, update] = compileShader(root)

  useFrame((_, dt) => update(dt))

  return shader
}

export default function StacksExample() {
  const shader = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          ref={material}
        />
      </mesh>
    </group>
  )
}
