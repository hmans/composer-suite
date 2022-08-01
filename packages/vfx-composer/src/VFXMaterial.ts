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

export type VFXMaterialArgs = iCSMParams & {
  modules: ModulePipe
}

export class VFXMaterial extends CustomShaderMaterial {
  private _modules: ModulePipe | undefined = undefined

  get modules() {
    return this._modules
  }

  set modules(v: ModulePipe | undefined) {
    if (this._modules !== v) {
      this._modules = v
    }
  }

  /**
   * The per-frame update function returned by compileShader.
   */
  private shaderUpdate?: (dt: number) => void

  /**
   * The Shader Composer root node for this material.
   */
  public shaderRoot?: Unit

  constructor(args: VFXMaterialArgs = {} as VFXMaterialArgs) {
    super({ ...args, baseMaterial: MeshStandardMaterial })
    this.modules = args.modules || []
  }

  public compileModules() {
    /* Define an initial module state. */
    const initialState: ModuleState = {
      position: VertexPosition,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`)
    }

    /* Transform state with given modules. */
    const { position, color, alpha } = pipeModules(
      initialState,
      ...(this._modules || [])
    )

    /* Create a shader root. We're currently using CSM for everything, so
    always pick a CustomShaderMaterialMaster. */
    this.shaderRoot = CustomShaderMaterialMaster({
      position,
      diffuseColor: color,
      alpha
    })

    /* And finally compile a shader from the state. */
    const [shader, { update }] = compileShader(this.shaderRoot)

    /* And let CSM know that it was updated. */
    super.update({ ...shader })

    this.shaderUpdate = update
  }

  tick(dt: number) {
    this.shaderUpdate?.(dt)
  }
}
