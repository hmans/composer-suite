import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { iCSMParams } from "three-custom-shader-material/types"

export class ParticlesMaterial extends CustomShaderMaterial {
  constructor(opts: Pick<iCSMParams, "baseMaterial">) {
    super(opts)
  }
}
