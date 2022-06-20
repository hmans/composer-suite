import { module } from ".."

export default function(fun = "v_progress") {
  return module({
    vertexHeader: `
    attribute vec4 color0;
    attribute vec4 color1;
    varying vec4 v_color0;
    varying vec4 v_color1;
  `,
    vertexMain: `
    v_color0 = color0;
    v_color1 = color1;
  `,
    fragmentHeader: `
    varying vec4 v_color0;
    varying vec4 v_color1;
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
  `
  })
}
