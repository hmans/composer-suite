import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import {
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  VertexPositionNode,
  MixNode,
  MultiplyNode,
  Parameter,
  StackNode,
  TimeNode,
  vec3,
  SoftlightBlendNode
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
      time: float(TimeNode())
    },
    out: {
      value: vec3("in_a")
    },
    vertex: {
      body: `out_value.${axis} *= (1.0 + sin(in_time * in_frequency) * 0.5);`
    }
  }))

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  in: {
    a: vec3(),

    frequency: float(1),
    time: float(TimeNode())
  },
  out: {
    value: vec3("in_a")
  },
  vertex: {
    body: `out_value.x *= (1.0 + sin(in_time * in_frequency + position.y * 0.3 + position.x * 0.3) * 0.2);`
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
  const AnimationStack = StackNode("vec3", "Animation Stack")
  const ColorStack = StackNode("vec3", "Color Stack")

  const root = CustomShaderMaterialMasterNode({
    position: AnimationStack(VertexPositionNode(), [
      SqueezeWithTime({ frequency: 0.1 }),
      ScaleWithTime("x")({ frequency: 0.2 }),
      ScaleWithTime("y")({ frequency: 0.1 }),
      ScaleWithTime("z")({ frequency: 0.3 }),
      MoveWithTime("x")({ frequency: 0.8, amplitude: 2 }),
      MoveWithTime("y")({ frequency: 0.6, amplitude: 1 }),
      MoveWithTime("z")({ frequency: 0.3, amplitude: 2 })
    ]),

    diffuseColor: ColorStack(new Color("#3dd"), [
      SoftlightBlendNode({
        opacity: 0.8,
        b: MultiplyNode({
          a: new Color(2, 2, 2) as Parameter<"vec3">,
          b: FresnelNode()
        })
      })
    ])
  })

  return compileShader(root)
}

export default function StacksExample() {
  const [shaderProps, update] = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        />
      </mesh>
    </group>
  )
}
