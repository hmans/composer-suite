import {
  CustomShaderMaterialMaster,
  expr,
  Float,
  Simplex3DNoise,
  Smoothstep,
  snippet,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const mul = snippet(
      (name) => `float ${name}(float a, float b) { return a * b; }`
    )

    const add = snippet(
      (name) =>
        expr`float ${name}(float a, float b) { return a + ${mul}(b, 2.0); }`
    )

    const a = Float(1)
    const b = Float(2)

    const c = Vec3(new Color("hotpink"))

    const noise = Simplex3DNoise(VertexPosition)

    return CustomShaderMaterialMaster({
      diffuseColor: new Color("hotpink"),
      alpha: Smoothstep(0.0, 0.2, noise)
    })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

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
