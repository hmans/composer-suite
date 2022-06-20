import {
  BufferAttribute,
  BufferGeometry,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"

export function createAttributes(items: number, type = BufferAttribute) {
  /* Helper method to create new instanced buffer attributes */
  const createAttribute = (itemSize: number) =>
    new type(new Float32Array(items * itemSize), itemSize)

  /* Let's define a number of attributes. */
  return {
    time: createAttribute(2),
    velocity: createAttribute(3),
    acceleration: createAttribute(3),
    color0: createAttribute(4),
    color1: createAttribute(4),
    scale0: createAttribute(3),
    scale1: createAttribute(3)
  }
}

export function registerAttributes(
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
