import { module } from ".."

export default function scale(fun = "v_progress") {
  return module({
    attributes: {
      scale0: { itemSize: 3 },
      scale1: { itemSize: 3 }
    },

    vertexHeader: `
    attribute vec3 scale0;
    attribute vec3 scale1;
  `,
    vertexMain: `
    csm_Position *= mix(scale0, scale1, ${fun});
  `
  })
}
