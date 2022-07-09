import {
  Add,
  CustomShaderMaterialMaster,
  Divide,
  expr,
  Float,
  Fresnel,
  Multiply,
  Simplex3DNoise,
  Smoothstep,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const a = Float(1)
    const b = Float(2)

    // return Float(expr`${a} + ${b}`)

    const t = Time

    const noise = Smoothstep(
      0,
      0.01,
      Simplex3DNoise(Divide(VertexPosition, 10))
    )

    return CustomShaderMaterialMaster({
      diffuseColor: Add(new Color("#8f8"), Multiply(new Color("#88f"), noise))
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
          metalness={0}
          roughness={0}
        />
      </mesh>
    </group>
  )
}
