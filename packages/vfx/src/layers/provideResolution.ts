import { createShader, Uniform } from "../newShaders"

export default function() {
  const u_resolution: Uniform = {
    type: "vec2",
    value: [window.innerWidth, window.innerHeight]
  }

  return createShader({
    uniforms: { u_resolution },

    update: ({ size }) => {
      u_resolution.value = [size.width, size.height]
    }
  })
}
