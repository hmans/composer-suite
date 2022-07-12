import { useFrame } from "@react-three/fiber"
import {
  Add,
  code,
  CustomShaderMaterialMaster,
  Float,
  ModelMatrix,
  ModifyVertex,
  Mul,
  Multiply,
  Pipe,
  Remap,
  Resolution,
  Sampler2D,
  Simplex3DNoise,
  Step,
  Texture2D,
  Time,
  Uniform,
  UV,
  Value,
  Vec2,
  Vec4,
  VertexNormal,
  VertexPosition,
  ViewMatrix
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial, Vector2 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { DustExample } from "./DustExample"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { useShader } from "./useShader"

/* TODO: refactor this after we've cleaned up our dependency pruning */
const FragmentCoordinates = Vec2(new Vector2(), {
  fragmentBody: `value = gl_FragCoord.xy;`
})

const ScreenUV = Vec2(code`${FragmentCoordinates} / ${Resolution}`)

export default function ShadenfreudeWater() {
  const { depthTexture } = useDepthBuffer()

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

    const Depth = (sampler: Sampler2D, uv: Value<"vec2">) => {
      const cameraNear = Uniform("float", "u_cameraNear")
      const cameraFar = Uniform("float", "u_cameraFar")

      const ViewPosition = Vec4(
        code`${ViewMatrix} * ${ModelMatrix} * vec4(${VertexPosition}, 1.0)`,
        { varying: true }
      )

      return Float(code`${uv}.x`, {
        name: "Depth Difference",

        fragmentBody: code`
          /* Get the existing depth at the fragment position, in eye units */
          float depth = perspectiveDepthToViewZ(
            ${Texture2D(sampler, ScreenUV)}.x,
            ${cameraNear},
            ${cameraFar});

          value = ${ViewPosition}.z - depth;
        `
      })
    }

    const depth = Depth(Sampler2D("u_depth"), UV)

    return CustomShaderMaterialMaster({
      position,
      normal,
      diffuseColor: Pipe(
        new Color("#bce"),
        ($) => Add($, Mul(foam, 0.03)),
        ($) => Add($, code`1.0 - ${Step(0.8, depth)}`)
      )
    })
  }, [])

  const uniforms = {
    ...shader.uniforms,
    u_depth: { value: depthTexture },
    u_cameraNear: { value: 0 },
    u_cameraFar: { value: 0 }
  }

  useFrame(({ camera }) => {
    uniforms.u_cameraNear.value = camera.near
    uniforms.u_cameraFar.value = camera.far
  })

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={-8}>
      {/* <Fog /> */}
      <DustExample />
      <mesh>
        <boxGeometry args={[500, 5, 500, 100, 1, 100]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          uniforms={uniforms}
          transparent
          side={DoubleSide}
          // wireframe
        />
      </mesh>
    </group>
  )
}
