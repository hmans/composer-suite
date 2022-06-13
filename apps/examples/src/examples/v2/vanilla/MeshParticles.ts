import {
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D
} from "three"
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
  constructor(
    geometry?: BufferGeometry,
    material?: ParticlesMaterial,
    public maxParticles = 1000,
    public safetyParticles = 100
  ) {
    super(geometry, material, maxParticles + safetyParticles)
  }

  spawnParticles(count: number, setup?: ParticleSetupFunction) {
    for (let i = 0; i < count; i++) {
      /* Write instance matrix */
      tmpObj.position.set(0, 0, 0)
      tmpObj.quaternion.set(0, 0, 0, 1)
      tmpObj.scale.setScalar(1)
      this.setMatrixAt(0, tmpObj.matrix)

      /* Write time values */
      this.geometry.attributes.time.setXY(0, 0, 1)

      this.count = 1
    }
  }

  spawnParticle(setup?: ParticleSetupFunction) {
    this.spawnParticles(1, setup)
  }

  configureParticles(modules: ShaderModule[]) {
    /* Set up the basic attributes we need */
    this.createAttribute("time", 2)

    /* Uniforms */
    const uniformsChunk = /*glsl*/ `
      uniform float u_time;
      uniform bool u_billboard;
    `

    /* Varyings */
    const varyingsChunk = /*glsl*/ `
      varying float v_timeStart;
      varying float v_timeEnd;
      varying float v_progress;
      varying float v_age;
      varying vec4 v_colorStart;
      varying vec4 v_colorEnd;
    `

    /* Attributes */
    const attributesChunk = /*glsl*/ `
      attribute vec2 time;
      attribute vec3 velocity;
      attribute vec3 acceleration;
      attribute vec4 colorStart;
      attribute vec4 colorEnd;
      attribute vec3 scaleStart;
      attribute vec3 scaleEnd;
    `

    const vertexShader = /*glsl*/ `
      ${uniformsChunk}
      ${attributesChunk}
      ${varyingsChunk}

      ${modules.map(generateModuleFunction).join("\n")}

      /* Set the varyings we want to forward */
      void setVaryings() {
        v_timeStart = time.x;
        v_timeEnd = time.y;
        // v_colorStart = colorStart;
        // v_colorEnd = colorEnd;
        // v_age = u_time - v_timeStart;
        // v_progress = v_age / (v_timeEnd - v_timeStart);
      }


      void main() {
        setVaryings();

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
      ${uniformsChunk}
      ${varyingsChunk}

      void main() {
        /* Lifetime management: discard this instance if it is not in the current time range */
        if (u_time < v_timeStart || u_time > v_timeEnd) {
          discard;
        }
      }
    `

    const uniforms = {
      u_time: { value: 0 }
    }

    this.material.update({ vertexShader, fragmentShader, uniforms })
  }

  private createAttribute(name: string, itemSize: number) {
    const totalParticles = this.maxParticles + this.safetyParticles
    const data = new Float32Array(totalParticles * itemSize)
    const buffer = new InstancedBufferAttribute(data, itemSize)
    this.geometry.setAttribute(name, buffer)
  }
}
