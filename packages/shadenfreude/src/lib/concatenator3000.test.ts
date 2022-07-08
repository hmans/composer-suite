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
    expect(s.name).toEqual("snippet_31feb6d4164510e096ef2b0f71622b546bf46ebe")
  })

  it("will generate the same snippet IDs for the same contents", () => {
    let code = "/* code */"
    const s1 = snippet(() => code)
    const s2 = snippet(() => code)
    expect(s1.name).toEqual("snippet_31feb6d4164510e096ef2b0f71622b546bf46ebe")
    expect(s2.name).toEqual("snippet_31feb6d4164510e096ef2b0f71622b546bf46ebe")
  })

  it("creates a snippet with a rendered chunk", () => {
    const s = snippet((name) => `/* hi from ${name} */`)

    expect(s).toMatchInlineSnapshot(`
      Object {
        "_": "Snippet",
        "chunk": Array [
          "#ifndef unique_snippet_4af96d391f3b3f895b83baf57706b2808919303c",
          "#define unique_snippet_4af96d391f3b3f895b83baf57706b2808919303c",
          "/* hi from snippet_4af96d391f3b3f895b83baf57706b2808919303c */",
          "#endif",
        ],
        "name": "snippet_4af96d391f3b3f895b83baf57706b2808919303c",
      }
    `)
  })
})
