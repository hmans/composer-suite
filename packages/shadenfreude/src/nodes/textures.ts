import { code } from "../expressions"
import { Bool, GLSLType, Node, Value, Vec4, withAPI } from "../tree"

/* TODO: find a better way to create the uniform here. Maybe reference an actual Uniform node and make it not write itself into a variable? */
export const Sampler2D = (name: string) =>
  withAPI(
    Bool(true, {
      name: `Sampler2D: ${name}`,
      vertexHeader: `uniform sampler2D ${name};`,
      fragmentHeader: `uniform sampler2D ${name};`
    }),

    {
      toString: () => name
    }
  )

export const Texture2D = (
  sampler2D: ReturnType<typeof Sampler2D>,
  xy: Value<"vec2">
) => Vec4(code`texture2D(${sampler2D}, ${xy})`)
