import { concatenate, flatten } from "./concatenator3000"

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
