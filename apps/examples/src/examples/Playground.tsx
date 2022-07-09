import {
  Add,
  CustomShaderMaterialMaster,
  expr,
  Float,
  Fresnel,
  Multiply,
  Smoothstep,
  Time,
  Vec3
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const a = Float(1)
    const b = Float(2)

    const color = Vec3(new Color("hotpink"))
    const fresnelColor = Vec3(new Color(2, 2, 2))

    // return Float(expr`${a} + ${b}`)

    const t = Time

    return CustomShaderMaterialMaster({
      diffuseColor: Add(color, Multiply(fresnelColor, Fresnel()))
    })
  }, [])

  console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
