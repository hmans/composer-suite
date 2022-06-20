import { module } from "."

export default function time() {
  return module({
    vertexHeader: `uniform float u_time;`,
    fragmentHeader: `uniform float u_time;`
  })
}
