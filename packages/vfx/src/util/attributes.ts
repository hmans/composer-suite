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
  /* Get the composed shader from the material */
  const { composedShader } = imesh.material.__vfx

  /* Now create all the attributes configured in the composed shader. */
  const attributes = Object.keys(composedShader.attributes).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new InstancedBufferAttribute(
        new Float32Array(
          maxInstanceCount * composedShader.attributes[name].itemSize
        ),
        composedShader.attributes[name].itemSize
      )
    }),
    {}
  )

  prepareInstancedMesh(imesh, attributes)
}
