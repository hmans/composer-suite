import { createShader } from "../lib/shadermaker"

export default function() {
  const configurator = {
    delay: 0,
    lifetime: 1
  }

  return createShader({
    attributes: {
      time: { type: "vec2", itemSize: 2 }
    },

    varyings: {
      v_progress: { type: "float" },
      v_age: { type: "float" }
    },

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
    `,

    configurator,

    reset: (mesh) => {
      configurator.delay = 0
      configurator.lifetime = 1
    },

    apply: (mesh, cursor) => {
      /* Set times */
      const currentTime = mesh.material.uniforms.u_time.value
      mesh.geometry.attributes.time.setXY(
        cursor,
        currentTime + configurator.delay,
        currentTime + configurator.lifetime
      )
    }
  })
}
