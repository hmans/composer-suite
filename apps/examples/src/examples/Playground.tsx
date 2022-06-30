import { useMemo, useRef } from "react"
import { compileShader, float, node, set, Value } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

type FloatProps = { a?: Value<"float"> }

const FloatNode = (props?: FloatProps) =>
  set(
    node({
      name: "Float Value",
      inputs: {
        a: float()
      },
      outputs: {
        value: float("a")
      }
    })
  ).to(props)

const RootNode = (props?: { offset: Value<"float"> }) =>
  set(
    node({
      name: "Root Node",
      inputs: {
        offset: float()
      },
      vertex: {
        body: "csm_Position.x += offset;"
      }
    })
  ).to(props)

function useShader() {
  return useMemo(() => {
    const float = FloatNode({ a: 12 })
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
