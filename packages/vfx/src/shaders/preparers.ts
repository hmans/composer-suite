import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"
import { MeshParticlesMaterial } from "../MeshParticles"
import { GLSLType } from "../shaders"

const itemSizes: Record<GLSLType, number> = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat4: 16,
  sampler2D: 1,
  samplerCube: 1,
  bool: 1
}

export const prepareInstancedMesh = (
  imesh: InstancedMesh<InstancedBufferGeometry, MeshParticlesMaterial>,
  maxInstanceCount: number
) => {
  /* Get the composed shader from the material */
  const { shader } = imesh.material.__vfx

  /* Now create all the attributes configured in the composed shader. */
  for (const name in shader.attributes) {
    const itemSize = itemSizes[shader.attributes[name].type]
    const buffer = new Float32Array(maxInstanceCount * itemSize)
    const attribute = new InstancedBufferAttribute(buffer, itemSize)

    imesh.geometry.setAttribute(name, attribute)
  }

  imesh.count = 0
}
