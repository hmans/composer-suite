import { createShader, Uniform } from "../shaders"

export default function() {
  const u_time: Uniform = { type: "float", value: 0 }

  return createShader({
    uniforms: { u_time },
    update: (_, dt) => (u_time.value += dt)
  })
}
