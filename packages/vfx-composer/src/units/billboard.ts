import {
  Snippet,
  Input,
  Vec3,
  ViewMatrix,
  InstanceMatrix,
  $
} from "shader-composer"

/* TODO: move this into a shader-composer-* package! */

export const billboard = Snippet(
  (name) => $`
    vec3 ${name}(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }
  `
)

export const Billboard = (position: Input<"vec3">) =>
  Vec3($`${billboard}(${position}.xy, ${ViewMatrix} * ${InstanceMatrix})`)
