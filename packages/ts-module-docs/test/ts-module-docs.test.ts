import { extractModuleDocumentation } from "../src"

describe("extractModuleDocumentation", () => {
  const extractDocs = () =>
    extractModuleDocumentation(
      __dirname + "/mock/tsconfig.json",
      __dirname + "/mock/mock.ts"
    )

  it("extracts name and description", () => {
    const docs = extractDocs()

    const first = docs.symbols[0]

    expect(first.name).toMatchInlineSnapshot(`"add"`)

    expect(first.description).toMatchInlineSnapshot(`
      "Adds two numbers and returns the result.

      It's pretty basic, but it's nice!

      "
    `)
  })
})
