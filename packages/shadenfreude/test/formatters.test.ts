import { formatValue } from "../src/formatters"
import * as THREE from "three"

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

  describe("argument is THREE.Color", () => {
    it("should render the color's vec3 representation", () => {
      expect(formatValue(new THREE.Color(0.1, 0.2, 0.3))).toBe(
        "vec3(0.10000, 0.20000, 0.30000)"
      )
    })
  })

  describe("argument is THREE.Vector2", () => {
    it("should render the vector's vec2 representation", () => {
      expect(formatValue(new THREE.Vector2(1, 2))).toBe(
        "vec2(1.00000, 2.00000)"
      )
    })
  })

  describe("argument is THREE.Vector3", () => {
    it("should render the vector's vec3 representation", () => {
      expect(formatValue(new THREE.Vector3(1, 2, 3))).toBe(
        "vec3(1.00000, 2.00000, 3.00000)"
      )
    })
  })

  describe("argument is THREE.Vector4", () => {
    it("should render the vector's vec4 representation", () => {
      expect(formatValue(new THREE.Vector4(1, 2, 3, 4))).toBe(
        "vec4(1.00000, 2.00000, 3.00000, 4.00000)"
      )
    })
  })
})
