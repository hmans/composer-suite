import {
  Add,
  CustomShaderMaterialMaster,
  expr,
  Float,
  Mix,
  Mul,
  Multiply,
  Pipe,
  Pow,
  Remap,
  Simplex3DNoise,
  Smoothstep,
  Step,
  Sub,
  Subtract,
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
      Remap(Simplex3DNoise(Vec3(Mul(VertexPosition, 0.11))), -1, 1, 0, 1),
      1.5
    )

    const steppedNoise = Smoothstep(-0, 1, noise)

    const waterHeight = Float(
      expr`0.3 + sin(${Time} + ${VertexPosition}.y) * 0.02`
    )

    return CustomShaderMaterialMaster({
      position: Mul(VertexPosition, Float(expr`1.0 + ${steppedNoise} * 0.3`)),

      diffuseColor: Pipe(
        Vec3(new Color("#66c")),
        /* Water noise yooooo */
        ($) =>
          Mix(
            $,
            new Color("#67d"),
            Step(
              0,
              Simplex3DNoise(
                Add(Vec3(Mul(VertexPosition, 0.3)), Mul(Time, 0.05))
              )
            )
          ),
        /* Foam */
        ($) => Mix($, new Color("#ddf"), Step(Sub(waterHeight, 0.02), noise)),
        /* Sand */
        ($) => Mix($, new Color("#ec5"), Step(waterHeight, noise)),
        /* Green */
        ($) => Mix($, new Color("#494"), Step(0.34, noise)),
        /* Mountains */
        ($) => Mix($, new Color("#ccc"), Step(0.5, noise)),
        /* Skyrim */
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
