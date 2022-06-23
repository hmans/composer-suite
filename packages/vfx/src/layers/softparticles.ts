import { createShader, formatValue, Variables } from "../shaders"

export default function(
  softness = 1,
  fun = "clamp(distance / softness, 0.0, 1.0)"
) {
  const uniforms: Variables = {
    u_cameraNear: { type: "float", value: 0 },
    u_cameraFar: { type: "float", value: 1 }
  }

  return createShader({
    uniforms,

    varyings: {
      v_viewZ: { type: "float" }
    },

    vertexMain: `
      vec4 viewPosition	= viewMatrix * instanceMatrix * modelMatrix * vec4(csm_Position, 1.0);
      v_viewZ = viewPosition.z;
    `,

    fragmentHeader: `
      float readDepth(vec2 coord) {
        float depthZ = texture2D(u_depth, coord).x;
        float viewZ = perspectiveDepthToViewZ(depthZ, u_cameraNear, u_cameraFar);
        return viewZ;
      }
    `,

    fragmentMain: `
      /* Normalize fragment coordinates to screen space */
      vec2 screenUv = gl_FragCoord.xy / u_resolution;

      /* Get the existing depth at the fragment position */
      float depth = readDepth(screenUv);

      {
        /* Prepare some convenient local variables */
        float d = depth;
        float z = v_viewZ;
        float softness = ${formatValue(softness)};

        /* Calculate the distance to the fragment */
        float distance = z - d;

        /* Apply the distance to the fragment alpha */
        csm_DiffuseColor.a *= ${fun};
      }
    `,

    update: ({ camera }) => {
      uniforms.u_cameraNear.value = camera.near
      uniforms.u_cameraFar.value = camera.far
    }
  })
}
