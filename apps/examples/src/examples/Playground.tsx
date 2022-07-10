import {
  Vec3,
  Mul,
  VertexPosition,
  Pow,
  Remap,
  Simplex3DNoise,
  code,
  Smoothstep,
  Float,
  Time,
  Step,
  Add,
  Dissolve,
  Sin,
  CustomShaderMaterialMaster,
  Pipe,
  Mix,
  Sub
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const scaledPos = Vec3(Mul(VertexPosition, 0.11))

    const noise = Pow(
      Remap(Simplex3DNoise(code`${scaledPos}`), -1, 1, 0, 1),
      1.5
    )

    const steppedNoise = Smoothstep(-0, 1, noise)

    const waterHeight = Float(
      code`0.3 + sin(${Time} + ${VertexPosition}.y) * 0.02`
    )

    const waterNoise = Step(
      0,
      Simplex3DNoise(Add(Vec3(Mul(VertexPosition, 0.3)), Mul(Time, 0.05)))
    )

    const dissolve = Dissolve(Smoothstep(-0.5, 0.5, Sin(Time)), 0.1)

    return CustomShaderMaterialMaster({
      position: Mul(VertexPosition, Float(code`1.0 + ${steppedNoise} * 0.3`)),

      diffuseColor: Pipe(
        Vec3(new Color("#66c")),
        /* Water noise yooooo */
        ($) => Mix($, new Color("#67d"), waterNoise),
        /* Foam */
        ($) => Mix($, new Color("#ddf"), Step(Sub(waterHeight, 0.02), noise)),
        /* Sand */
        ($) => Mix($, new Color("#ec5"), Step(waterHeight, noise)),
        /* Green */
        ($) => Mix($, new Color("#494"), Step(0.34, noise)),
        /* Mountains */
        ($) => Mix($, new Color("#ccc"), Step(0.5, noise)),
        /* Skyrim */
        ($) => Mix($, new Color("#fff"), Step(0.7, noise)),
        ($) => Add($, dissolve.color)
      ),

      alpha: dissolve.alpha
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
