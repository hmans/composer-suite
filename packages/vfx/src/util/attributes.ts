import {
  BufferAttribute,
  BufferGeometry,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"

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
