import { formatValue } from "../src/compilers"

describe("formatValue", () => {
  describe("argument is number", () => {
    it("should render the number's float representation with a precision of 5", () => {
      expect(formatValue(1)).toBe("1.00000")
      expect(formatValue(1.234)).toBe("1.23400")
      expect(formatValue(1.23456789)).toBe("1.23457")
    })
  })

  describe("argument is string", () => {
    it("should just plain render out the argument", () => {
      expect(formatValue("foo")).toBe("foo")
    })
  })
})
