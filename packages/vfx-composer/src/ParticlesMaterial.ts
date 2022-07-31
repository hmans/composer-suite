import {
  $,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Unit,
  Vec3,
  VertexPosition
} from "shader-composer"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { ModulePipe, ModuleState, pipeModules } from "./modules"
import { Particles } from "./Particles"

export type ParticlesMaterialArgs = iCSMParams & {
  modules: ModulePipe
}

export class ParticlesMaterial extends CustomShaderMaterial {
  private shaderUpdate: (dt: number) => void
  public shaderRoot: Unit

  constructor({ modules, ...args }: ParticlesMaterialArgs) {
    /* Define an initial module state. */
    const initialState: ModuleState = {
      position: VertexPosition,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`)
    }

    /* Transform state with given modules. */
    const { position, color, alpha } = pipeModules(initialState, ...modules)

    const shaderRoot = CustomShaderMaterialMaster({
      position,
      diffuseColor: color,
      alpha
    })

    /* And finally compile a shader from the state. */
    const [shader, { update }] = compileShader(shaderRoot)

    super({ ...args, ...shader })

    this.shaderRoot = shaderRoot
    this.shaderUpdate = update
  }

  tick(dt: number) {
    this.shaderUpdate(dt)
  }
}
