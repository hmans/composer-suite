import { code } from "../expressions"
import { Bool, Float, Value, Vec3, Vec4, withAPI } from "../tree"

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

export type Sampler2D = ReturnType<typeof Sampler2D>

export const Texture2D = (sampler2D: Sampler2D, xy: Value<"vec2">) => {
  const node = Vec4(code`texture2D(${sampler2D}, ${xy})`)

  return withAPI(node, {
    color: Vec3(code`${node}.rgb`),
    alpha: Float(code`${node}.a`)
  })
}
