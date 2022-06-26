import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { compileShader, float, node, Variable, vec3, nodes } from "shadenfreude"
import { MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const colorValue = () =>
  node({
    name: "Color Value",
    outputs: {
      color: vec3(new Vector3(1, 0.6, 0.1))
    }
  })

const wobble = (inputs?: { time?: Variable }) =>
  node({
    name: "Wobble",
    inputs: { time: float(inputs?.time) },
    outputs: { offset: vec3() },
    vertex: { body: `offset.x = sin(time * 2.5) * 5.0;` }
  })

function useShader() {
  return useMemo(() => {
    const { time } = nodes.time().outputs

    const root = nodes.master({
      diffuseColor: nodes.softlightBlend({
        a: colorValue().outputs.color,
        b: nodes.fresnel().outputs.fresnel,
        opacity: nodes.floatValue(1).outputs.value
      }).outputs.result,

      position: nodes.add(
        wobble({ time }).outputs.offset,
        nodes.vertexPositionNode().outputs.position
      )
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()

  // console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} />
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
