import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import {
  ColorNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  GeometryPositionNode,
  MixNode,
  MultiplyNode,
  TimeNode,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  in: {
    origin: vec3(GeometryPositionNode())
  },
  out: {
    value: vec3("in_origin")
  },
  filters: [
    SqueezeWithTime({ frequency: 0.1 }),
    ScaleWithTime({ frequency: 0.2 }, { axis: "x" }),
    ScaleWithTime({ frequency: 0.1 }, { axis: "y" }),
    ScaleWithTime({ frequency: 0.3 }, { axis: "z" }),
    MoveWithTime({ frequency: 0.8, amplitude: 2 }, { axis: "x" }),
    MoveWithTime({ frequency: 0.6, amplitude: 1 }, { axis: "y" }),
    MoveWithTime({ frequency: 0.3, amplitude: 2 }, { axis: "z" })
  ]
}))

const ScaleWithTime = Factory<{ axis?: string }>(({ axis = "xyz" }) => ({
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

const SqueezeWithTime = Factory<{ axis?: string }>(() => ({
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

const MoveWithTime = Factory<{ axis?: string }>(({ axis = "xyz" }) => ({
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

const ColorStack = Factory(() => ({
  name: "Color Stack",
  in: {
    color: vec3(ColorNode({ value: new Color("hotpink") }))
  },
  out: {
    value: vec3("in_color")
  },
  filters: [
    MixNode("vec3")({
      a: vec3(),
      b: MultiplyNode({ a: new Color(2, 2, 2), b: FresnelNode() }),
      amount: 0.5
    })
  ]
}))

function useShader() {
  const root = CustomShaderMaterialMasterNode({
    position: AnimationStack(),
    diffuseColor: ColorStack()
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
