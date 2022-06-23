import { Color } from "three"
import { createShader } from "../shaders"

export default function(fun = "v_progress") {
  const config = {
    color: {
      min: new Color(),
      max: new Color()
    },
    alpha: {
      min: 1,
      max: 1
    }
  }

  return createShader({
    attributes: {
      color0: { type: "vec4" },
      color1: { type: "vec4" }
    },

    varyings: {
      v_color0: { type: "vec4" },
      v_color1: { type: "vec4" }
    },

    vertexMain: `
      v_color0 = color0;
      v_color1 = color1;
    `,

    fragmentMain: `
      /* Get diffuse color */
      vec4 diffuse4 = vec4(diffuse, 1.0);

      /* Apply the diffuse color */
      csm_DiffuseColor = mix(diffuse4 * v_color0, diffuse4 * v_color1, ${fun});

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    `,

    config,

    resetConfig: (mesh) => {
      config.color.min.setRGB(1, 1, 1)
      config.color.max.setRGB(1, 1, 1)
      config.alpha.min = 1
      config.alpha.max = 1
    },

    applyConfig: ({ geometry: { attributes } }, cursor) => {
      /* Set color */
      attributes.color0.setXYZW(
        cursor,
        config.color.min.r,
        config.color.min.g,
        config.color.min.b,
        config.alpha.min
      )
      attributes.color1.setXYZW(
        cursor,
        config.color.max.r,
        config.color.max.g,
        config.color.max.b,
        config.alpha.max
      )
    }
  })
}
