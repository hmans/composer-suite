import { extractModuleDocumentation } from "../src"

describe("extractModuleDocumentation", () => {
  it("does a thing", () => {
    const docs = extractModuleDocumentation(
      __dirname + "/mock/tsconfig.json",
      __dirname + "/mock/mock.ts"
    )
  })
})
