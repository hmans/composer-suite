import * as THREE from "three"

export const multiplyByMatrix = (
  points: Float32Array,
  matrix: THREE.Matrix4
) => {
  const buffer = new THREE.Float32BufferAttribute(points, 3)
  buffer.applyMatrix4(matrix)
  return buffer.array
}
