import { createShader } from "../lib/shadermaker"

export default function(fun = "v_progress") {
  return createShader({
    attributes: {
      scale0: { type: "vec3", itemSize: 3 },
      scale1: { type: "vec3", itemSize: 3 }
    },

    vertexMain: `
      csm_Position *= mix(scale0, scale1, ${fun});
    `

    // configurator: () => ({
    //   scale: {
    //     min: new Vector3(),
    //     max: new Vector3()
    //   }
    // }),

    // setup: ({ attributes }, index, { scale: { min, max } }) => {
    //   attributes.scale0.setXYZ(index, ...min.toArray())
    //   attributes.scale1.setXYZ(index, ...max.toArray())
    // }
  })
}
