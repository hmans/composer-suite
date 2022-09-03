import { extractModuleDocumentation } from "../src"

describe("extractModuleDocumentation", () => {
  it("does a thing", () => {
    const docs = extractModuleDocumentation(
      "tsconfig.json",
      "packages/ts-module-docs/src/index.ts"
    )

    expect(docs).toMatchInlineSnapshot(`
      Object {
        "symbols": Array [
          Object {
            "doc": undefined,
            "name": "extractModuleDocumentation",
          },
          Object {
            "doc": undefined,
            "name": "renderDocNode",
          },
          Object {
            "doc": undefined,
            "name": "renderDocNodes",
          },
        ],
      }
    `)
  })
})
