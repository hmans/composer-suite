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
  const { compiled } = imesh.material.__vfx

  const attributes = Object.keys(compiled.attributes).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new InstancedBufferAttribute(
        new Float32Array(maxInstanceCount * compiled.attributes[name].itemSize),
        compiled.attributes[name].itemSize
      )
    }),
    {}
  )

  prepareInstancedMesh(imesh, attributes)
}
