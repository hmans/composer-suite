import { Unit } from "shader-composer"
import { Material } from "three"

export const materialShaderRoots = new WeakMap<Material, Unit>()

/**
 * A somewhat experimental, possibly temporary API to retrieve the Shader Composer
 * shader graph for a given material. This allows interested parties (like VFX
 * Composer's Particles class) to inspect the shader graph that was compiled for
 * the given material.
 *
 * @param material A Material instance
 * @returns The root unit of the Shader Composer graph for the given material
 */
export const getShaderRootForMaterial = (material: Material) =>
  materialShaderRoots.get(material)
