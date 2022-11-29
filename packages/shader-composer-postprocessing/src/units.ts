import { $, Float, Vec2, Vec3 } from "@shader-composer/three"

export const InputColor = Vec3($`inputColor.rgb`)
export const InputAlpha = Float($`inputColor.a`)
export const UV = Vec2($`uv`)
