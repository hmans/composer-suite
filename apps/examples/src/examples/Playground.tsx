import {
  Add,
  CustomShaderMaterialMaster,
  expr,
  Float,
  Mix,
  Multiply,
  Pipe,
  Pow,
  Remap,
  Simplex3DNoise,
  Smoothstep,
  Step,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const noise = Pow(
      Remap(Simplex3DNoise(Vec3(Multiply(VertexPosition, 0.11))), -1, 1, 0, 1),
      1.5
    )

    const steppedNoise = Smoothstep(-0, 1, noise)

    const waterHeight = Float(
      expr`0.3 + sin(${Time} + ${VertexPosition}.y) * 0.02`
    )

    return CustomShaderMaterialMaster({
      position: Multiply(
        VertexPosition,
        Float(expr`1.0 + ${steppedNoise} * 0.3`)
      ),

      diffuseColor: Pipe(
        Vec3(new Color("#66c")),
        ($) => Mix($, new Color("#68f"), Step(waterHeight, noise)),
        ($) => Mix($, new Color("#ec5"), Step(Add(waterHeight, 0.02), noise)),
        ($) => Mix($, new Color("#494"), Step(0.34, noise)),
        ($) => Mix($, new Color("#ccc"), Step(0.5, noise)),
        ($) => Mix($, new Color("#fff"), Step(0.7, noise))
      )
    })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={18}>
      {/* <Fog /> */}
      <DustExample />
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
