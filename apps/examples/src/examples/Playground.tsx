import {
  Add,
  code,
  CustomShaderMaterialMaster,
  Dissolve,
  Float,
  Mix,
  Mul,
  Multiply,
  Pipe,
  Pow,
  Remap,
  Simplex3DNoise,
  Sin,
  Smoothstep,
  Step,
  Sub,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import { useShader } from "./useShader"

const ScaledNoise = (scale = 1, timeScale = 1) =>
  Simplex3DNoise(
    Add(Multiply(VertexPosition, scale), Multiply(Time, timeScale))
  )

export default function Playground() {
  const shader = useShader(() => {
    const bigwaves = ScaledNoise(0.008, 0.1)
    const waves = ScaledNoise(0.025, 0.1)
    const ripples = ScaledNoise(5, 0.8)
    const foam = Step(0, ScaledNoise(0.1, 0.1))

    return CustomShaderMaterialMaster({
      position: Pipe(
        VertexPosition,
        ($) => Add($, Add(Multiply(bigwaves, 4), 2)),
        ($) => Add($, Add(Multiply(waves, 2), 1)),
        ($) => Add($, Add(Multiply(ripples, 0.4), 0.2))
      ),
      diffuseColor: Pipe(Vec3(new Color("#99b")), ($) =>
        Add($, Multiply(foam, 0.03))
      ),
      alpha: 0.9
    })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={-5}>
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
