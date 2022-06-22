import { createShader } from "../newShaders"

export default function() {
  return createShader({
    attributes: {
      time: { type: "vec2", itemSize: 2 }
    },
    varyings: {
      v_progress: { type: "float" },
      v_age: { type: "float" }
    },
    vertexHeader: `
      attribute vec2 time;
    `,
    vertexMain: `
      v_age = u_time - time.x;
      v_progress = v_age / (time.y - time.x);

      if (v_progress < 0.0 || v_progress > 1.0) {
        csm_Position *= 0.0;;
      }
    `,
    fragmentMain: `
      /* Discard this instance if it is not in the current time range */
      if (v_progress < 0.0 || v_progress > 1.0) {
        discard;
      }
    `
  })
}
