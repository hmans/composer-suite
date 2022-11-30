export { compileShader } from "./compiler"
export { disableDebugging, enableDebugging } from "./debug"
export * from "./expressions"
export * from "./glslType"
export * from "./snippets"
export * from "./stdlib"
export * from "./tree"
export * from "./units"

export let frameTime = 0

function tick(time: number) {
  frameTime = time / 1000
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
