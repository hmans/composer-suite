import { compileShader, Unit } from "shader-composer"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"

export type ParticlesMaterialArgs = iCSMParams & { shaderRoot: Unit }

export class ParticlesMaterial extends CustomShaderMaterial {
  private shaderUpdate: (dt: number) => void

  constructor({ shaderRoot, ...args }: ParticlesMaterialArgs) {
    const [shader, { update }] = compileShader(shaderRoot)
    super({ ...args, ...shader })
    this.shaderUpdate = update
  }

  tick(dt: number) {
    this.shaderUpdate(dt)
  }
}
