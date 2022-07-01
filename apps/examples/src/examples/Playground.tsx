import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  compileShader,
  ComposeNode,
  Factory,
  float,
  Parameter,
  PositionNode,
  TimeNode,
  vec2,
  vec3,
  vec4
} from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const CSMMasterNode = Factory(() => ({
  name: "CustomShaderMaterial Master",
  in: {
    position: vec3()
  },
  vertex: {
    body: "csm_Position = in_position;"
  }
}))

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

function useShader() {
  return useMemo(() => {
    const time = TimeNode()

    const root = CSMMasterNode({
      position: AddNode({
        a: PositionNode(),
        b: WobbleAnimation({ frequency: 2, amplitude: 3, time })
      })
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const [shaderProps, update] = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

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
