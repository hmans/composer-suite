import { module } from "."

export default function movement() {
  return module({
    vertexHeader: `
      attribute vec3 velocity;
      attribute vec3 acceleration;
    `,
    vertexMain: `
      csm_Position += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration) * mat3(instanceMatrix);
    `
  })
}
