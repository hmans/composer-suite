import {
  BufferAttribute,
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"
import { MeshParticlesMaterial } from "../MeshParticles"

function registerAttributes(
  geometry: BufferGeometry,
  attributes: Record<string, BufferAttribute>
) {
  for (const name in attributes) {
    geometry.setAttribute(name, attributes[name])
  }
}

export function prepareInstancedMesh(
  mesh: InstancedMesh,
  attributes: Record<string, BufferAttribute>
) {
  registerAttributes(mesh.geometry, attributes)
  mesh.count = 0
}

export const setupInstancedMesh = (
  imesh: InstancedMesh<InstancedBufferGeometry, MeshParticlesMaterial>,
  maxInstanceCount: number
) => {
  console.log(imesh.material.__vfx)

  /* Helper method to create new instanced buffer attributes */
  const createAttribute = (itemSize: number) =>
    new InstancedBufferAttribute(
      new Float32Array(maxInstanceCount * itemSize),
      itemSize
    )

  /* Let's define a number of attributes. */
  const attributes = {
    time: createAttribute(2),
    velocity: createAttribute(3),
    acceleration: createAttribute(3),
    color0: createAttribute(4),
    color1: createAttribute(4),
    scale0: createAttribute(3),
    scale1: createAttribute(3)
  }

  prepareInstancedMesh(imesh, attributes)
}
