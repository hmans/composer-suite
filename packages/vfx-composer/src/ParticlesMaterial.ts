import {
  $,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Vec3,
  VertexPosition
} from "shader-composer"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { ModulePipe, pipeModules } from "./modules"

export type ParticlesMaterialArgs = iCSMParams & {
  modules: ModulePipe
}

export class ParticlesMaterial extends CustomShaderMaterial {
  private shaderUpdate: (dt: number) => void

  constructor({ modules, ...args }: ParticlesMaterialArgs) {
    const initialState = {
      position: VertexPosition,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`)
    }

    /* Transform state with given modules */
    const { position, color, alpha } = pipeModules(initialState, ...modules)

    const [shader, { update }] = compileShader(
      CustomShaderMaterialMaster({
        position,
        diffuseColor: color,
        alpha
      })
    )

    super({ ...args, ...shader })

    this.shaderUpdate = update
  }

  tick(dt: number) {
    this.shaderUpdate(dt)
  }
}
