import { concatenate, flatten, snippet } from "./concatenator3000"

describe("flatten", () => {
  it("doesn't modify a boring flat list of values", () => {
    const f = flatten(1, 2, 3)
    expect(f).toEqual([1, 2, 3])
  })

  it("filters blank parts", () => {
    const f = flatten(false, 1, "", 2, undefined, 3, null, 4)
    expect(f).toEqual([1, 2, 3, 4])
  })

  it("flattens nested arrays", () => {
    const f = flatten(1, 2, [3, [4, 5], 6], 7)
    expect(f).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})

describe("concatenate", () => {
  it("compiles the given parts into a string", () => {
    expect(concatenate("a", "b", "c")).toEqual("a\nb\nc")
    expect(concatenate("a", null, "c")).toEqual("a\nc")
    expect(concatenate("a", ["b"], "c")).toEqual("a\nb\nc")
  })
})

describe("snippet", () => {
  it("creates a Snippet with a unique name", () => {
    const s = snippet(() => "/* code */")
    expect(s.name).toEqual(
      "snippet_a996254afd1b407b9a44d2758225d5d208faa14c6e5b839596b3cdd8313dcbcb"
    )
  })

  it("will generate the same snippet IDs for the same contents", () => {
    let code = "/* code */"
    const s1 = snippet(() => code)
    const s2 = snippet(() => code)
    expect(s1.name).toEqual(
      "snippet_a996254afd1b407b9a44d2758225d5d208faa14c6e5b839596b3cdd8313dcbcb"
    )
    expect(s2.name).toEqual(
      "snippet_a996254afd1b407b9a44d2758225d5d208faa14c6e5b839596b3cdd8313dcbcb"
    )
  })

  it("creates a snippet with a rendered chunk", () => {
    const s = snippet((name) => `/* hi from ${name} */`)
    expect(s).toMatchSnapshot()
  })

  it("will only render once per program", () => {
    const s = snippet((name) => `/* hi from ${name} */`)
    expect(concatenate(s, s, s)).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_b117418551e1b8d4b59f6c1e18105f25177e09509cd53bdfc6f76de146877259 ***/
      /* hi from snippet_b117418551e1b8d4b59f6c1e18105f25177e09509cd53bdfc6f76de146877259 */"
    `)
  })

  it("allows a snippet to have dependencies to other snippets", () => {
    const dependency = snippet(() => "/* I'm a dependency */")

    const s = snippet(() => "/* I'm a snippet that uses the dependency */", [
      dependency
    ])

    expect(concatenate(s)).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_3e4f1b759eeeef3974130c653d8946525fc658e0480296913221de96a874ff38 ***/
      /* I'm a dependency */
      /*** SNIPPET: snippet_8ebae88c6c0e293fffce560b3c6dddc8fd51b136f1de1583f75ed98b8f47a206 ***/
      /* I'm a snippet that uses the dependency */"
    `)
  })
})
