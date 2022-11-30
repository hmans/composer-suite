import { $ } from "../src/expressions"
import { Snippet } from "../src/snippets"
import { Float, Root, Vec3 } from "../src/stdlib"
import { collectFromTree, Item, walkTree } from "../src/tree"
import { isUnit } from "../src/units"

describe("walkTree", () => {
  it("walks a given node tree", () => {
    const a = Float(1)

    const snippet = Snippet(() => $`${a}`)
    const expr = $`${snippet}`
    const root = Float(expr)

    const seen = new Array<Item>()
    walkTree(root, "any", (item) => seen.push(item))
    expect(seen).toEqual([
      1,
      a._unitConfig.value,
      a,
      snippet,
      expr,
      root._unitConfig.value,
      root
    ])
  })

  it("includes constant values", () => {
    const a = 123
    const root = Vec3(a)

    const seen = new Array<Item>()
    walkTree(root, "any", (item) => seen.push(item))
    expect(seen).toEqual([a, root._unitConfig.value, root])
  })

  describe("when a program is specified", () => {
    it("only visits the items contained in that program", () => {
      const a = Float(1)
      const b = Float(2)
      const root = Root({
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
