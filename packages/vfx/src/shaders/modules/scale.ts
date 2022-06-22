import { Vector3 } from "three"
import { module } from ".."

export default function scale(fun = "v_progress") {
  return module<{ scale: { min: Vector3; max: Vector3 } }>({
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
    `,

    configurator: () => ({
      scale: {
        min: new Vector3(),
        max: new Vector3()
      }
    }),

    setup: ({ attributes }, index, { scale: { min, max } }) => {
      attributes.scale0.setXYZ(index, ...min.toArray())
      attributes.scale1.setXYZ(index, ...max.toArray())
    }
  })
}
