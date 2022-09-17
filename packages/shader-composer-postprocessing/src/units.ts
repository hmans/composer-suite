import { $, Vec2, Vec3 } from "shader-composer"

export const InputColor = Vec3($`inputColorRGBA.rgb`)
export const InputAlpha = Vec3($`inputColorRGBA.a`)
export const UV = Vec2($`uv`)
