import { module } from ".."

export default function(uniform = "u_resolution") {
  return module({
    uniforms: {
      [uniform]: { value: [window.innerWidth, window.innerHeight] }
    },
    vertexHeader: `uniform vec2 ${uniform};`,
    fragmentHeader: `uniform vec2 ${uniform};`
  })
}
