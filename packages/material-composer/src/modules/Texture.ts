import { isUnit, Texture2D, UniformUnit, Unit, UV } from "shader-composer"
import * as THREE from "three"
import { ModuleFactory } from ".."

export type TextureArgs = {
  texture: Unit<"sampler2D"> | THREE.Texture
  uv?: Unit<"vec2">
}

/**
 * Applies a texture to the material. The `texture` parameter can either be a
 * Shader Composer unit of type `sampler2D`, or a Three.js texture instance.
 * Note that when you pass the latter, it will automatically be converted into
 * a uniform.
 *
 * @param params0.texture A Three.js texture or a Shader Composer unit of type `sampler2D`.
 * @param params0.uv The UV coordinates to use for the texture. Defaults to the UV data provided by the material.
 */
export const Texture: ModuleFactory<TextureArgs> = ({ texture, uv = UV }) => (
  state
) => {
  const sampler = isUnit(texture) ? texture : UniformUnit("sampler2D", texture)
  const sampled = Texture2D(sampler, uv)
  return { ...state, color: sampled.color, alpha: sampled.alpha }
}
