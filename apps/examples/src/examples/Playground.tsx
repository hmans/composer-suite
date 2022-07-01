import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  AddNode,
  compileShader,
  Factory,
  float,
  Parameter,
  PositionNode,
  TimeNode,
  vec3
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
    t: float(),

    /** How fast to wobble */
    frequency: float(1),

    /** How hard to wobble */
    amplitude: float(1)
  },

  out: {
    /** The wobble value */
    value: float("sin(in_t * in_frequency) * in_amplitude")
  }
}))

const CombineVector3Node = Factory(() => ({
  name: "Combine Vector3",
  in: {
    x: float(),
    y: float(),
    z: float()
  },
  out: {
    value: vec3("vec3(in_x, in_y, in_z)")
  }
}))

type WobbleProps = {
  frequency?: number
  amplitude?: number
  time?: Parameter<"float">
}

function WobbleAnimation({
  frequency = 1,
  amplitude = 1,
  time: t = TimeNode()
}: WobbleProps) {
  return CombineVector3Node({
    x: WobbleNode({ t, frequency: 8 * frequency, amplitude }),
    y: WobbleNode({ t, frequency: 5 * frequency, amplitude }),
    z: WobbleNode({ t, frequency: 3 * frequency, amplitude })
  })
}

function useShader() {
  const time = TimeNode()

  return useMemo(() => {
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
