import { compileShader } from "../compilers"
import { code } from "../expressions"
import { Float } from "../node"
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
    expect(s.name).toEqual("snippet_a996254afd")
  })

  it("will generate the same snippet IDs for the same contents", () => {
    let code = "/* code */"
    const s1 = snippet(() => code)
    const s2 = snippet(() => code)
    expect(s1.name).toEqual("snippet_a996254afd")
    expect(s2.name).toEqual("snippet_a996254afd")
  })

  it("creates a snippet with a rendered chunk", () => {
    const s = snippet((name) => `/* hi from ${name} */`)
    expect(s).toMatchSnapshot()
  })

  it("will only render once per program", () => {
    const add = snippet(
      (name) => `float ${name}(float a, float b) { return a + b; }`
    )

    const f = Float(code`${add}(1, ${add}(2, 3))`)
    const [shader] = compileShader(f)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_7dd01b876a ***/
      float snippet_7dd01b876a(float a, float b) { return a + b; }
      void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = snippet_7dd01b876a(1, snippet_7dd01b876a(2, 3));
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

      }"
    `)
  })

  it("allows a snippet to have dependencies to other snippets", () => {
    const mul = snippet(
      (name) => `float ${name}(float a, float b) { return a * b; }`
    )

    const add = snippet(
      (name) =>
        code`float ${name}(float a, float b) { return a + ${mul}(a, b); }`
    )

    const f = Float(code`${add}(1, ${add}(2, 3))`)
    const [shader] = compileShader(f)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_3853dce07c ***/
      float snippet_3853dce07c(float a, float b) { return a * b; }
      /*** SNIPPET: snippet_98a183b64b ***/
      float snippet_98a183b64b(float a, float b) { return a + snippet_3853dce07c(a, b); }
      void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = snippet_98a183b64b(1, snippet_98a183b64b(2, 3));
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

      }"
    `)
  })
})
