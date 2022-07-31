import {
  Add,
  CustomShaderMaterialMaster,
  pipe,
  Time,
  VertexPosition
} from "shader-composer"
import { Material } from "three"
import { ParticlesMaterial } from "./ParticlesMaterial"

export const patchMaterial = (material: Material) =>
  new ParticlesMaterial({
    baseMaterial: material,
    shaderRoot: CustomShaderMaterialMaster({
      position: pipe(VertexPosition, (v) => Add(v, Time()))
    })
  })
