import {
  Add,
  CustomShaderMaterialMaster,
  expr,
  Float,
  Fresnel,
  Mix,
  Multiply,
  Pipe,
  Simplex3DNoise,
  Sin,
  Smoothstep,
  Step,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const noise = Simplex3DNoise(Vec3(Multiply(VertexPosition, 0.11)))

    const steppedNoise = Smoothstep(-0.5, 0.5, noise)

    const waterHeight = Float(
      expr`-0.1 + sin(${Time} + ${VertexPosition}.y) * 0.02`
    )

    return CustomShaderMaterialMaster({
      position: Pipe(VertexPosition, ($) =>
        Vec3(expr`${$} * (1.0 + ${steppedNoise} * 0.3)`)
      ),

      diffuseColor: Pipe(
        Vec3(new Color("#66c")),
        ($) => Mix($, new Color("#ec5"), Step(waterHeight, noise)),
        ($) => Mix($, new Color("#494"), Step(0, noise)),
        ($) => Mix($, new Color("#ccc"), Step(0.3, noise)),
        ($) => Mix($, new Color("#fff"), Step(0.5, noise))
      )
    })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={18}>
      <mesh>
        <icosahedronGeometry args={[12, 4]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
