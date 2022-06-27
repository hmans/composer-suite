export const glsl = (glsl: string) => glsl.replace(/\s+/g, " ").trim()

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeGLSL(expected: string): R
    }
  }
}

/* TODO: move this into some global support file */
expect.extend({
  toBeGLSL(received, expected) {
    const pass = glsl(received) === glsl(expected)

    if (pass) {
      return {
        message: () => `expected ${received} to not be equal to ${expected}`,
        pass: true
      }
    }

    return {
      message: () => `expected ${received} to be equal to ${expected}`,
      pass: false
    }
  }
})
