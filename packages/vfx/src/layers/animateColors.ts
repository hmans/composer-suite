import { Color } from "three"
import { createShader } from "../lib/shadermaker"

export default function(fun = "v_progress") {
  const configurator = {
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
      color0: { type: "vec4", itemSize: 4 },
      color1: { type: "vec4", itemSize: 4 }
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

    configurator,

    reset: (mesh) => {
      configurator.color.min.setRGB(1, 1, 1)
      configurator.color.max.setRGB(1, 1, 1)
      configurator.alpha.min = 1
      configurator.alpha.max = 1
    },

    apply: ({ geometry: { attributes } }, cursor) => {
      /* Set color */
      attributes.color0.setXYZW(
        cursor,
        configurator.color.min.r,
        configurator.color.min.g,
        configurator.color.min.b,
        configurator.alpha.min
      )
      attributes.color1.setXYZW(
        cursor,
        configurator.color.max.r,
        configurator.color.max.g,
        configurator.color.max.b,
        configurator.alpha.max
      )
    }
  })
}
