import {
  $,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Unit,
  Vec3,
  VertexPosition
} from "shader-composer"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { ModulePipe, ModuleState } from "./modules"
import { pipeModules } from "./util/pipeModules"

export type ParticlesMaterialArgs = iCSMParams & {
  modules: ModulePipe
}

export class ParticlesMaterial extends CustomShaderMaterial {
  private _modules: ModulePipe = []

  get modules() {
    return this._modules
  }

  set modules(v: ModulePipe) {
    if (this._modules !== v) {
      this._modules = v
      this.setupShader()
    }
  }

  private shaderUpdate?: (dt: number) => void
  public shaderRoot?: Unit

  constructor(args: ParticlesMaterialArgs = {} as ParticlesMaterialArgs) {
    super({
      ...args,
      baseMaterial: MeshStandardMaterial
    })

    this.modules = args.modules || []
  }

  setupShader() {
    /* Define an initial module state. */
    const initialState: ModuleState = {
      position: VertexPosition,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`)
    }

    /* Transform state with given modules. */
    const { position, color, alpha } = pipeModules(
      initialState,
      ...this._modules
    )

    const shaderRoot = CustomShaderMaterialMaster({
      position,
      diffuseColor: color,
      alpha
    })

    /* And finally compile a shader from the state. */
    const [shader, { update }] = compileShader(shaderRoot)

    super.update({ ...shader })

    this.shaderRoot = shaderRoot
    this.shaderUpdate = update
  }

  tick(dt: number) {
    this.shaderUpdate?.(dt)
  }
}
