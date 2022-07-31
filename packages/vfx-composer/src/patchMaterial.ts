import { Unit } from "shader-composer"
import { Material } from "three"
import { ParticlesMaterial } from "./ParticlesMaterial"

export const patchMaterial = (baseMaterial: Material, shaderRoot: Unit) =>
  new ParticlesMaterial({
    baseMaterial,
    shaderRoot
  })
