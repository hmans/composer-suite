import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { useTexture } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { useControls } from "leva"
import {
  Add,
  GlobalTime,
  Mul,
  NormalizePlusMinusOne,
  Pow,
  Texture2D,
  Vec2,
  Vec3,
  VertexNormal,
  VertexPosition
} from "shader-composer"
import { useShader, useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise3D, Turbulence3D } from "shader-composer-toybox"
import textureUrl from "./textures/explosion.png"

export default function Fireball() {
  /* Expose some controls via Leva. */
  const controls = useControls("Fireball", {
    turbulenceScale: { value: 0.25, min: 0, max: 2 },
    turbulenceOctaves: { value: 5, min: 1, max: 10, step: 1 }
  })

  /* Create some uniforms. */
  const turbulenceScale = useUniformUnit("float", controls.turbulenceScale)
  const turbulenceOctaves = useUniformUnit("float", controls.turbulenceOctaves)
  const sampler2D = useUniformUnit("sampler2D", useTexture(textureUrl))

  /* Create our shader. */
  const shader = useShader(() => {
    /* Create a time unit. Always useful! */
    const time = GlobalTime

    /* Create a unit with a displacement factor calculated from 3D noise. */
    const displacement = pipe(
      VertexPosition,
      (v) => Add(v, Mul(time, 0.3)),
      (v) => PSRDNoise3D(v),
      (v) => Mul(v, 0.1)
    )

    /* Create another unit that calculates the fragment color based on
		noise turbulence. */
    const color = pipe(
      time,
      /* Modify the original vertex position using offset based on time. */
      (v) => Vec3([Mul(v, 0.1), Mul(v, 0.3), Mul(v, 0.5)]),
      (v) => Add(VertexPosition, v),

      /* Apply the user-provided turbulence scale. */
      (v) => Mul(v, turbulenceScale),

      /* Calculate the turbulence. */
      (v) => Turbulence3D(v, turbulenceOctaves),
      (v) => NormalizePlusMinusOne(v),
      (v) => Pow(v, 0.5),

      /* Source the color from the provided texture. */
      (v) => Texture2D(sampler2D, Vec2([0, v])).color
    )

    return PatchedMaterialMaster({
      /* Modify the vertex position based on the displacement value. */
      position: pipe(
        displacement,
        (v) => Mul(VertexNormal, v),
        (v) => Add(VertexPosition, v)
      ),

      /* Apply color values. */
      color,
      emissiveColor: Mul(color, 1.5)
    })
  }, [])

  return (
    <mesh>
      <icosahedronGeometry args={[1, 5]} />
      <patched.meshStandardMaterial {...shader} />
    </mesh>
  )
}
