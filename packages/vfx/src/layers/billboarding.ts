import { createShader } from "../newShaders"

export default function() {
  return createShader({
    vertexHeader: `
    /* Billboard helper */
    vec3 billboard(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }
  `,
    vertexMain: `
    csm_Position = billboard(csm_Position.xy, viewMatrix);
  `
  })
}
