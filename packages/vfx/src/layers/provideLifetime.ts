import { createShader } from "../shaders"

export default function() {
  const config = {
    lifetime: {
      delay: 0,
      duration: 1
    }
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

    config,

    resetConfig: (mesh) => {
      config.lifetime.delay = 0
      config.lifetime.duration = Infinity
    },

    applyConfig: (mesh, cursor) => {
      /* Set times */
      const currentTime = mesh.material.uniforms.u_time.value
      mesh.geometry.attributes.time.setXY(
        cursor,
        currentTime + config.lifetime.delay,
        currentTime + config.lifetime.delay + config.lifetime.duration
      )
    }
  })
}
