import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"
import { MeshParticlesMaterial } from "../MeshParticles"

export const setupInstancedMesh = (
  imesh: InstancedMesh<InstancedBufferGeometry, MeshParticlesMaterial>,
  maxInstanceCount: number
) => {
  /* Get the composed shader from the material */
  const { shader } = imesh.material.__vfx

  /* Now create all the attributes configured in the composed shader. */
  for (const name in shader.attributes) {
    const { itemSize } = shader.attributes[name]

    const buffer = new Float32Array(maxInstanceCount * itemSize)
    const attribute = new InstancedBufferAttribute(buffer, itemSize)

    imesh.geometry.setAttribute(name, attribute)
  }

  imesh.count = 0
}
