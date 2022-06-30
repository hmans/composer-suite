import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { compileShader, Factory, float, TimeNode, vec3 } from "shadenfreude"
import { FloatType, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const CSMMasterNode = Factory(() => ({
  name: "CSM Master",
  in: {
    position: vec3()
  },
  vertex: {
    body: "csm_Position += in_position;"
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

function useShader() {
  return useMemo(() => {
    const time = TimeNode()

    const root = CSMMasterNode({
      position: CombineVector3Node({
        x: WobbleNode({ t: time, frequency: 8, amplitude: 3 }),
        y: WobbleNode({ t: time, frequency: 5, amplitude: 3 }),
        z: WobbleNode({ t: time, frequency: 3, amplitude: 3 })
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
