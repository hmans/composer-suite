import { module } from ".."

export default function scale(fun = "v_progress") {
  return module({
    vertexHeader: `
    attribute vec3 scale0;
    attribute vec3 scale1;
  `,
    vertexMain: `
    csm_Position *= mix(scale0, scale1, ${fun});
  `
  })
}
