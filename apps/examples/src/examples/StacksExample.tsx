import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import {
  AddNode,
  ColorNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  GeometryPositionNode,
  MultiplyNode,
  TimeNode,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  out: {
    value: vec3()
  },
  filters: [
    GeometryPositionNode(),
    ScaleWithTime({ frequency: 0.5 }, { axis: "x" }),
    ScaleWithTime({ frequency: 0.7 }, { axis: "y" }),
    ScaleWithTime({ frequency: 0.9 }, { axis: "z" })
  ]
}))

const ScaleWithTime = Factory<{ axis?: string }>(({ axis = "xyz" }) => ({
  name: "Scale with Time",
  in: {
    value: vec3(),
    frequency: float(1),
    time: float(TimeNode())
  },
  out: {
    value: vec3("in_value")
  },
  vertex: {
    body: `out_value.${axis} *= (1.0 + sin(in_time * in_frequency) * 0.5);`
  }
}))

const FauxLamina = Factory(() => ({
  in: {
    value: vec3(),
    color: vec3(),
    intensity: float(0.5)
  },
  out: {
    value: vec3("in_color * in_intensity + in_value * (1.0 - in_intensity)")
  }
}))

const ColorStack = Factory(() => ({
  name: "Color Stack",
  out: {
    value: vec3()
  },
  filters: [
    ColorNode({ value: new Color("hotpink") }),
    FauxLamina({
      color: MultiplyNode({ a: new Color(2, 2, 2), b: FresnelNode() }),
      intensity: 0.5
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
        <sphereGeometry args={[8, 32, 32]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        />
      </mesh>
    </group>
  )
}
