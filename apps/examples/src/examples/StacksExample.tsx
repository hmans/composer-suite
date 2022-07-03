import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import {
  BlendNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  MultiplyNode,
  Parameter,
  ShaderNode,
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

    inputs: {
      a: vec3(),
      frequency: float(1),
      time: float(TimeNode())
    },

    outputs: {
      value: vec3("inputs.a")
    },

    vertex: {
      body: `outputs.value.${axis} *= (1.0 + sin(inputs.time * inputs.frequency) * 0.5);`
    }
  }))

const SqueezeWithTime = Factory(() => ({
  name: "Squeeze with Time",
  inputs: {
    a: vec3(),

    frequency: float(1),
    time: float(TimeNode())
  },
  outputs: {
    value: vec3("inputs.a")
  },
  vertex: {
    body: `outputs.value.x *= (1.0 + sin(inputs.time * inputs.frequency + position.y * 0.3 + position.x * 0.3) * 0.2);`
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

function useShader() {
  const root = CustomShaderMaterialMasterNode({
    position: ShaderNode({
      name: "Animation Stack",
      outputs: { value: vec3(VertexPositionNode()) },
      filters: [
        SqueezeWithTime({ frequency: 0.1 }),
        ScaleWithTime("x")({ frequency: 0.2 }),
        ScaleWithTime("y")({ frequency: 0.1 }),
        ScaleWithTime("z")({ frequency: 0.3 }),
        MoveWithTime("x")({ frequency: 0.8, amplitude: 2 }),
        MoveWithTime("y")({ frequency: 0.6, amplitude: 1 }),
        MoveWithTime("z")({ frequency: 0.3, amplitude: 2 })
      ]
    }),

    diffuseColor: ShaderNode({
      name: "Color Stack",
      outputs: { value: vec3(new Color("#3dd")) },
      filters: [
        BlendNode({
          type: "vec3",
          mode: "softlight",
          opacity: 0.8,
          b: MultiplyNode({
            a: new Color(2, 2, 2) as Parameter<"vec3">,
            b: FresnelNode()
          })
        })
      ]
    })
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
