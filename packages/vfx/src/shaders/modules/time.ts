import { module } from ".."

export default function time(uniformName = "u_time") {
  let timeUniform = { value: 0 }

  return module({
    uniforms: {
      [uniformName]: timeUniform
    },
    vertexHeader: `uniform float ${uniformName};`,
    fragmentHeader: `uniform float ${uniformName};`,

    update: (_, dt) => {
      timeUniform.value += dt
    }
  })
}
