import { BufferGeometry, InstancedMesh } from "three"
import {
  generateModuleFunction,
  generateModuleInvocation,
  ShaderModule
} from "./modules"
import { ParticlesMaterial } from "./ParticlesMaterial"

export class MeshParticles extends InstancedMesh<
  BufferGeometry,
  ParticlesMaterial
> {
  configureParticles(modules: ShaderModule[]) {
    const vertexShader = /*glsl*/ `
    uniform float u_time;

    ${modules.map(generateModuleFunction).join("\n")}

    void main() {
      /* Start with an origin offset */
      vec3 offset = vec3(0.0, 0.0, 0.0);

      /* Invoke custom chunks */
      ${modules.map(generateModuleInvocation).join("\n")}

      /* Apply the instance matrix. */
      offset *= mat3(instanceMatrix);

      /* Apply the offset */
      csm_Position += offset;
    }
  `

    const fragmentShader = /*glsl*/ `
  `

    const uniforms = {
      u_time: { value: 0 }
    }

    this.material.update({ vertexShader, fragmentShader, uniforms })
  }
}
