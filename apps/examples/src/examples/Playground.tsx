import {
  Add,
  CustomShaderMaterialMaster,
  ModifyVertex,
  Mul,
  Multiply,
  Pipe,
  Remap,
  Simplex3DNoise,
  Step,
  Time,
  Value,
  VertexNormal,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const ScaledNoise = (scale = 1, timeScale = 1) =>
      Remap(
        Simplex3DNoise(
          Add(Multiply(VertexPosition, scale), Multiply(Time, timeScale))
        ),
        -1,
        1,
        0,
        1
      )

    /* Calculate noises */
    const bigwaves = ScaledNoise(0.008, 0.1)
    const waves = ScaledNoise(0.025, 0.1)
    const ripples = ScaledNoise(5, 0.8)
    const foam = Step(0.5, ScaledNoise(0.1, 0.1))

    /* Define a function that modifies the vertex position */
    const ApplyWaves = (v: Value<"vec3">) =>
      Pipe(
        v,
        ($) => Add($, Multiply(bigwaves, 8)),
        ($) => Add($, Multiply(waves, 4)),
        ($) => Add($, Multiply(ripples, 0.2))
      )

    const { position, normal } = ModifyVertex(
      VertexPosition,
      VertexNormal,
      ApplyWaves
    )

    return CustomShaderMaterialMaster({
      position,
      normal,
      diffuseColor: Pipe(new Color("#bce"), ($) => Add($, Mul(foam, 0.03))),
      alpha: 0.9
    })
  }, [])

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={-8}>
      {/* <Fog /> */}
      <DustExample />
      <mesh>
        <boxGeometry args={[500, 5, 500, 100, 1, 100]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
          // wireframe
        />
      </mesh>
    </group>
  )
}
