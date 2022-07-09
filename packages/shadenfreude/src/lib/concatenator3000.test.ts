import { compileShader } from "../compilers"
import { expr } from "../expressions"
import { Float } from "../variables"
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
    const add = snippet(
      (name) => `float ${name}(float a, float b) { return a + b; }`
    )

    const f = Float(expr`${add}(1, ${add}(2, 3))`)
    const [shader] = compileShader(f)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_7dd01b876ac51c46f2484f6773fa837250a0197f2f0ff0533ac7373df8cf6ab9 ***/
      float snippet_7dd01b876ac51c46f2484f6773fa837250a0197f2f0ff0533ac7373df8cf6ab9(float a, float b) { return a + b; }
      void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = snippet_7dd01b876ac51c46f2484f6773fa837250a0197f2f0ff0533ac7373df8cf6ab9(1, snippet_7dd01b876ac51c46f2484f6773fa837250a0197f2f0ff0533ac7373df8cf6ab9(2, 3));
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
        expr`float ${name}(float a, float b) { return a + ${mul}(a, b); }`
    )

    const f = Float(expr`${add}(1, ${add}(2, 3))`)
    const [shader] = compileShader(f)

    expect(shader.vertexShader).toMatchInlineSnapshot(`
      "/*** SNIPPET: snippet_3853dce07c2b5e268e8dfd14015417672771c0f7ffdb9d946747dfb86656afba ***/
      float snippet_3853dce07c2b5e268e8dfd14015417672771c0f7ffdb9d946747dfb86656afba(float a, float b) { return a * b; }
      /*** SNIPPET: snippet_9670319365a5bf2e01a7c10af84a990eb71f98161426bb28ba0ea23843a656ff ***/
      float snippet_9670319365a5bf2e01a7c10af84a990eb71f98161426bb28ba0ea23843a656ff(float a, float b) { return a + snippet_3853dce07c2b5e268e8dfd14015417672771c0f7ffdb9d946747dfb86656afba(a, b); }
      void main()
      {
        /*** BEGIN: anon (1) ***/
        float float_anon_1;
        {
          float value = snippet_9670319365a5bf2e01a7c10af84a990eb71f98161426bb28ba0ea23843a656ff(1, snippet_9670319365a5bf2e01a7c10af84a990eb71f98161426bb28ba0ea23843a656ff(2, 3));
          float_anon_1 = value;
        }
        /*** END: anon (1) ***/

      }"
    `)
  })
})
