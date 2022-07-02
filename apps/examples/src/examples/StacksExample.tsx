import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import {
  compileShader,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  GeometryPositionNode,
  TimeNode,
  vec3
} from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

const AnimationStack = Factory(() => ({
  name: "Animation Stack",
  out: {
    value: vec3(GeometryPositionNode())
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
    value: vec3()
  },
  vertex: {
    body: `in_value.${axis} *= (1.0 + sin(in_time * in_frequency) * 0.5); out_value = in_value;`
  }
}))

function useShader() {
  const root = CustomShaderMaterialMasterNode({
    position: AnimationStack()
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
