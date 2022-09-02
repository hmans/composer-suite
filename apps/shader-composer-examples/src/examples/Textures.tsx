import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import {
  $,
  Add,
  Fresnel,
  Mul,
  Texture2D,
  TilingUV,
  Time,
  UniformUnit,
  UV,
  vec2
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color } from "three"
import { useRepeatingTexture } from "./helpers"

export default function Textures() {
  const texture = useRepeatingTexture("/textures/hexgrid.jpg")

  const shader = useShader(() => {
    const offset = vec2(Mul(Time(), 0.05), 0)

    /* Create a texture sampler */
    const sampler2D = UniformUnit("sampler2D", texture)

    /* Get the texture information for the current fragment */
    const tex2d = Texture2D(sampler2D, TilingUV(UV, vec2(2, 1), offset))

    /* Define a color to tint the texture with */
    const color = new Color("hotpink")

    return PatchedMaterialMaster({
      color: $`${color} * ${tex2d.color}`,
      alpha: Add(Fresnel(), 0.1)
    })
  })

  return (
    <mesh>
      <icosahedronGeometry args={[1, 3]} />
      <patched.meshStandardMaterial {...shader} transparent />
    </mesh>
  )
}
