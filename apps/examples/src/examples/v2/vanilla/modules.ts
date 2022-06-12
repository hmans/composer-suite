import { float } from "./util"

export type ShaderModule = {
  name: string
  chunk: string
}

export const generateModuleFunction = ({ name, chunk }: ShaderModule) =>
  /*glsl*/ `vec3 ${name}(vec3 offset) { ${chunk} return offset; }`

export const generateModuleInvocation = ({ name }: ShaderModule) =>
  /*glsl*/ `offset = ${name}(offset);`

export const wobble: ShaderModule = {
  name: "wobble_462378", // needs to be unique, will automate this
  chunk: /*glsl*/ `
    offset.y += 8.0 + cos(u_time * 13.0) * 2.0;
    offset.x += 0.0 + sin(u_time * 7.0) * 2.0;
    offset.z += 0.0 + cos(u_time * 5.0) * 2.0;
  `
}

export const makeShake = (
  axis: "x" | "y" | "z",
  frequency = 1.234,
  amplitude = 1
): ShaderModule => ({
  name: "shake_48932749", // needs to be unique, will automate this
  chunk: /*glsl*/ `
    offset.${axis} += cos(u_time * ${float(frequency)}) * ${float(amplitude)};
  `
})
