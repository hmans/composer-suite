import { $ } from "../expressions"
import { Input, Unit } from "../units"
import { Float, Vec3, Vec4 } from "./values"

export const Texture2D = (sampler2D: Unit<"sampler2D">, xy: Input<"vec2">) => {
  const texture2D = Vec4($`texture2D(${sampler2D}, ${xy})`, {
    name: "Texture2D"
  })

  return {
    ...texture2D,

    /** The color value sampled from the texture. */
    color: Vec3($`${texture2D}.rgb`, { name: "Texture2D Color" }),

    /** The alpha value sampled from the texture. */
    alpha: Float($`${texture2D}.a`, { name: "Texture2D Alpha" })
  }
}
