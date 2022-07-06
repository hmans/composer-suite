import { GLSLType, float } from "../variables"

export const Uniform = (type: GLSLType, name: string) =>
  float(name, {
    title: `Uniform: ${name}`,
    vertexHeader: `uniform ${type} ${name};`,
    fragmentHeader: `uniform ${type} ${name};`
  })

export const Time = Uniform("float", "u_time")
