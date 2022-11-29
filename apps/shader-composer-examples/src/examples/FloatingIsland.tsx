import { Environment, Float as Floating } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { useControls } from "leva"
import { FlatStage } from "r3f-stage"
import {
  Add,
  Float,
  GreaterOrEqual,
  If,
  Input,
  Length,
  Mix,
  Mul,
  NormalizePlusMinusOne,
  Pow,
  Smoothstep,
  Step,
  Sub,
  Unit,
  varying,
  Vec2,
  Vec3
} from "@shader-composer/three"
import {
  Shader,
  ShaderMaster,
  useShader,
  useUniformUnit
} from "shader-composer-r3f"
import { Displacement, PSRDNoise2D } from "shader-composer-toybox"
import { Color, RGBADepthPacking, Vector2 } from "three"

export default function FloatingIslandExample() {
  return (
    <group>
      <Environment preset="sunset" />
      <FlatStage position-y={-2} />
      <Floating>
        <FloatingIsland />
      </Floating>
    </group>
  )
}

const FloatingIsland = () => {
  const controls = useControls("Floating Isle", {
    offset: { value: [0, 0], joystick: true, step: 0.1 },
    scale: { value: 1, min: 0.01, max: 3 }
  })

  const uniforms = {
    offset: useUniformUnit("vec2", new Vector2(...controls.offset), {
      name: "Noise Offset"
    }),

    scale: useUniformUnit("float", controls.scale, {
      name: "Noise Scale"
    })
  }

  /* Let's create the shader itself! */
  const shader = useShader(() => {
    /* A helper function that will generate some powered and scaled noise for us,
    taking into account the offset currently configured by the user. */
    const noise = (
      v: Input<"vec2">,
      scale: Input<"float"> = 1,
      height: Input<"float"> = 1,
      pow: Input<"float"> = 1
    ) =>
      pipe(
        PSRDNoise2D(Mul(Add(v, uniforms.offset), Mul(scale, uniforms.scale))),
        (v) => NormalizePlusMinusOne(v),
        (v) => Pow(v, pow),
        (v) => Mul(v, height)
      )

    /* Set up a displacement function. It takes the existing position of a vertex and
    modifies it according to our rules. */
    const displace = (v: Unit<"vec3">) => {
      const xz = Vec2([v.x, v.z])

      const height = pipe(
        Float(0.2),
        (v) => Sub(v, noise(xz, 0.5, 0.2)),
        (v) => Add(v, noise(xz, 0.2, 1)),
        (v) => Add(v, noise(xz, 1, 2, 3)),
        (v) => Mul(v, Smoothstep(2, 0.5, Length(xz)))
      )

      /* Displacement for the upper half of the island. */
      const displaceUpper = Vec3([v.x, height, v.z])

      /* Displacement for the lower half of the island. */
      const displaceLower = Vec3([v.x, Mul(v.y, 0.7), v.z])

      /* Displacement for the entire island. */
      return If(GreaterOrEqual(v.y, 0), displaceUpper, displaceLower)
    }

    /* Let's displace some vertices! We'll also wrap the position in a
    varying. If we don't do this, the fragment shader will end up
    recalculating the position for every fragment. */
    const position = varying(Displacement(displace).position)

    return ShaderMaster({
      position,

      color: pipe(Vec3(new Color("#1982c4")), (v) =>
        pipe(
          v,
          (v) => Mix(new Color("#252422"), v, Step(-0.2, position.y)),
          (v) => Mix(v, new Color("#adc178"), Step(0.02, position.y)),
          (v) => Mix(v, new Color("#3a5a40"), Step(0.3, position.y)),
          (v) => Mix(v, new Color("#4a4e69"), Step(0.5, position.y)),
          (v) => Mix(v, new Color("#fff"), Step(1.2, position.y))
        )
      )
    })
  }, [])

  return (
    <mesh castShadow receiveShadow>
      <dodecahedronGeometry args={[2, 5]} />

      <meshStandardMaterial flatShading metalness={0.5} roughness={0.5}>
        <Shader {...shader} />
      </meshStandardMaterial>

      {/* We don't need the fragment shader in the depth material. */}
      <meshDepthMaterial
        attach="customDepthMaterial"
        depthPacking={RGBADepthPacking}
      >
        <Shader vertexShader={shader.vertexShader} uniforms={shader.uniforms} />
      </meshDepthMaterial>
    </mesh>
  )
}
