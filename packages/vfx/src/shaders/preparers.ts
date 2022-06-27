import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh
} from "three"
import { GLSLType, Shader } from "../shaders"

const itemSizes: Record<GLSLType, number> = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1,
  samplerCube: 1,
  bool: 1
}

export const prepareInstancedMesh = (
  imesh: InstancedMesh<InstancedBufferGeometry>,
  shader: Shader,
  maxInstanceCount: number
) => {
  /* Create all the attributes configured in the shader. */
  for (const name in shader.attributes) {
    const itemSize = itemSizes[shader.attributes[name].type]
    const buffer = new Float32Array(maxInstanceCount * itemSize)
    const attribute = new InstancedBufferAttribute(buffer, itemSize)

    imesh.geometry.setAttribute(name, attribute)
  }

  /* Start with an instance count of zero. */
  imesh.count = 0
}
