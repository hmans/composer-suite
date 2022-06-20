import { module } from ".."

export default function(uniform = "u_resolution") {
  const uniforms = {
    [uniform]: { value: [window.innerWidth, window.innerHeight] }
  }
  return module({
    uniforms,
    vertexHeader: `uniform vec2 ${uniform};`,
    fragmentHeader: `uniform vec2 ${uniform};`,

    update: ({ size }) => {
      uniforms[uniform].value = [size.width, size.height]
    }
  })
}
