import { createShader } from "../lib/shadermaker"

export default function() {
  return createShader({
    attributes: {
      velocity: { type: "vec3", itemSize: 3 },
      acceleration: { type: "vec3", itemSize: 3 }
    },

    vertexMain: `
      csm_Position += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration) * mat3(instanceMatrix);
    `
  })
}
