import { Color } from "three"
import { $ } from "./expressions"
import { Snippet } from "./snippets"
import { Float, Master, Vec3 } from "./stdlib"
import { collectFromTree, Item, walkTree } from "./tree"
import { isUnit } from "./units"

describe("walkTree", () => {
  it("walks a given node tree", () => {
    const a = Float(1)
    const snippet = Snippet(() => $`${a}`)
    const expr = $`${snippet}`
    const root = Float(expr)

    const seen = new Array<Item>()
    walkTree(root, "any", (item) => seen.push(item))
    expect(seen).toEqual([1, a, snippet, expr, root])
  })

  it("includes constant values", () => {
    const color = new Color()
    const root = Vec3(color)

    const seen = new Array<Item>()
    walkTree(root, "any", (item) => seen.push(item))
    expect(seen).toEqual([color, root])
  })

  describe("when a program is specified", () => {
    it("only visits the items contained in that program", () => {
      const a = Float(1)
      const b = Float(2)
      const root = Master({
        vertex: { body: $`${a}` },
        fragment: { body: $`${b}` }
      })

      expect(collectFromTree(root, "vertex", isUnit)).toEqual([a, root])
      expect(collectFromTree(root, "fragment", isUnit)).toEqual([b, root])

      /* With "any", all items are visited. */
      expect(collectFromTree(root, "any", isUnit)).toEqual([a, b, root])
    })
  })
})
