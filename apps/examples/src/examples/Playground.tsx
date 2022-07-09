import {
  CustomShaderMaterialMaster,
  expr,
  Mix,
  Pipe,
  Simplex3DNoise,
  Smoothstep,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const noise = Simplex3DNoise(Vec3(expr`${VertexPosition} * 0.1`))

    const steppedNoise = Smoothstep(0, 0.1, noise)

    return CustomShaderMaterialMaster({
      position: Pipe(VertexPosition, ($) =>
        Vec3(expr`${$} * (1.0 + ${steppedNoise} * 0.3)`)
      ),

      diffuseColor: Mix(new Color("#333"), new Color("hotpink"), steppedNoise)
    })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 24]} />

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
