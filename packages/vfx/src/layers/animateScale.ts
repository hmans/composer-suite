import { Vector3 } from "three"
import { createShader } from "../shaders"

export default function(fun = "v_progress") {
  const config = {
    scale: {
      min: new Vector3(),
      max: new Vector3()
    }
  }

  return createShader({
    attributes: {
      scale0: { type: "vec3", itemSize: 3 },
      scale1: { type: "vec3", itemSize: 3 }
    },

    vertexMain: `
      csm_Position *= mix(scale0, scale1, ${fun});
    `,

    config,

    resetConfig: (mesh) => {
      config.scale.min.setScalar(1)
      config.scale.max.setScalar(1)
    },

    applyConfig: ({ geometry: { attributes } }, cursor) => {
      attributes.scale0.setXYZ(cursor, ...config.scale.min.toArray())
      attributes.scale1.setXYZ(cursor, ...config.scale.max.toArray())
    }
  })
}
