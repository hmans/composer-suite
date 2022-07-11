import { code } from "../expressions"
import { Bool, Value, Vec4 } from "../tree"

export const Sampler2D = (name: string) => {
  /* TODO: find a better way to create the uniform here. Maybe reference an actual Uniform node and make it not write itself into a variable? */
  const node = Bool(true, {
    name: `Sampler2D: ${name}`,
    vertexHeader: `uniform sampler2D ${name};`,
    fragmentHeader: `uniform sampler2D ${name};`
  })

  const api = {
    name,
    toString: () => name
  }

  return { ...node, ...api }
}

export const Texture2D = (
  sampler2D: ReturnType<typeof Sampler2D>,
  xy: Value<"vec2">
) => Vec4(code`texture2D(${sampler2D}, ${xy})`)
