import { Camera } from "@react-three/fiber"
import {
  $,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Unit,
  Vec3,
  VertexNormal,
  VertexPosition
} from "shader-composer"
import { MeshStandardMaterial, Scene, WebGLRenderer } from "three"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { ModulePipe, ModuleState } from "./modules"
import { pipeModules } from "./util/pipeModules"

export type VFXMaterialArgs = iCSMParams & {
  modules: ModulePipe
}

export class VFXMaterial extends CustomShaderMaterial {
  private _modules: ModulePipe = []

  get modules() {
    return this._modules
  }

  set modules(v: ModulePipe) {
    if (this._modules !== v) {
      this._modules = v
    }
  }

  /**
   * The per-frame update function returned by compileShader.
   */
  private shaderMeta?: {
    update: (
      dt: number,
      camera: Camera,
      scene: Scene,
      renderer: WebGLRenderer
    ) => void

    dispose: () => void
  }

  /**
   * The Shader Composer root node for this material.
   */
  public shaderRoot?: Unit

  constructor(args: VFXMaterialArgs = {} as VFXMaterialArgs) {
    super({ ...args, baseMaterial: MeshStandardMaterial })
    this.modules = args.modules || []
  }

  public compileModules() {
    /* If we've already had a shader, dispose of it. */
    this.shaderMeta?.dispose()

    /* Define an initial module state. */
    const initialState: ModuleState = {
      position: VertexPosition,
      normal: VertexNormal,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`)
    }

    /* Transform state with given modules. */
    const { position, normal, color, alpha } = pipeModules(
      initialState,
      ...(this._modules || [])
    )

    /* Create a shader root. We're currently using CSM for everything, so
    always pick a CustomShaderMaterialMaster. */
    this.shaderRoot = CustomShaderMaterialMaster({
      position,
      normal,
      diffuseColor: color,
      alpha
    })

    /* And finally compile a shader from the state. */
    const [shader, meta] = compileShader(this.shaderRoot)

    /* And let CSM know that it was updated. */
    super.update({ ...shader })

    this.shaderMeta = meta
  }

  tick(dt: number, camera: Camera, scene: Scene, renderer: WebGLRenderer) {
    this.shaderMeta?.update(dt, camera, scene, renderer)
  }

  dispose() {
    this.shaderMeta?.dispose()
    super.dispose()
  }
}
