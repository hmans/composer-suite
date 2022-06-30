import { useMemo, useRef } from "react"
import { compileShader, float, node, plug, Value } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

type FloatProps = { a?: Value<"float"> }

const FloatNode = (props?: FloatProps) =>
  node({
    name: "Float Value",
    inputs: {
      a: float(props?.a || 0)
    },
    outputs: {
      value: float("a")
    }
  })

const RootNode = (props?: { offset: Value<"float"> }) =>
  node({
    name: "Root Node",
    inputs: {
      offset: float(props?.offset || 0)
    },
    vertex: {
      body: "csm_Position.x += 12.0;"
    }
  })

function useShader() {
  return useMemo(() => {
    const float = FloatNode()
    const root = RootNode({ offset: float.outputs.value })

    // pipe(float.outputs.value).into(root.inputs.offset)

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  // useFrame((_, dt) => update(dt))

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
