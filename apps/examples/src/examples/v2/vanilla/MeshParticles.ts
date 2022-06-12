import { BufferGeometry, InstancedMesh, Object3D } from "three"
import {
  generateModuleFunction,
  generateModuleInvocation,
  ShaderModule
} from "./modules"
import { ParticlesMaterial } from "./ParticlesMaterial"

export type ParticleSetupFunction = () => void

const tmpObj = new Object3D()

export class MeshParticles extends InstancedMesh<
  BufferGeometry,
  ParticlesMaterial
> {
  public maxParticles: number

  constructor(
    geometry?: BufferGeometry,
    material?: ParticlesMaterial,
    maxParticles = 1000,
    safetyParticles = 100
  ) {
    super(geometry, material, maxParticles + safetyParticles)
    this.maxParticles = maxParticles
  }

  spawnParticles(count: number, setup?: ParticleSetupFunction) {
    for (let i = 0; i < count; i++) {
      /* Spawn a single particle */
      tmpObj.position.set(0, 0, 0)
      tmpObj.quaternion.set(0, 0, 0, 1)
      tmpObj.scale.setScalar(1)

      this.setMatrixAt(0, tmpObj.matrix)
      this.count = 1
    }
  }

  spawnParticle(setup?: ParticleSetupFunction) {
    this.spawnParticles(1, setup)
  }

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
