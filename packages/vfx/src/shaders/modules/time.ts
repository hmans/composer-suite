import { module } from ".."

export default function time(timeUniform = "u_time") {
  return module({
    uniforms: {
      [timeUniform]: { value: 0 }
    },
    vertexHeader: `uniform float ${timeUniform};`,
    fragmentHeader: `uniform float ${timeUniform};`
  })
}
