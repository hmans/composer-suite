import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { compileShader, float, plug, ShaderNode, Value } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const TimeNode = () =>
  ShaderNode({
    name: "Time",

    outputs: {
      value: float("u_time"),
      sin: float("sin(u_time)"),
      cos: float("cos(u_time)")
    },

    vertex: {
      header: "uniform float u_time;"
    },

    fragment: {
      header: "uniform float u_time;"
    }
  })

type FloatProps = { a?: Value<"float"> }

const FloatNode = (props?: FloatProps) =>
  ShaderNode(
    {
      name: "Float Value",
      inputs: {
        a: float()
      },
      outputs: {
        value: float("a")
      }
    },
    props
  )

const RootNode = (props?: { offset: Value<"float"> }) =>
  ShaderNode(
    {
      name: "Root Node",
      inputs: {
        offset: float()
      },
      vertex: {
        body: "csm_Position.x += offset;"
      }
    },
    props
  )

function useShader() {
  return useMemo(() => {
    const time = TimeNode()
    const float = FloatNode({ a: 12 })
    const root = RootNode()

    plug(time.outputs.sin).into(root.inputs.offset)

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
