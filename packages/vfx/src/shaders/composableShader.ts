export type GLSLType = "float" | "vec2" | "vec3" | "vec4" | "mat4" | "sampler2D"

export type Uniform<T = any> = {
  type: GLSLType
  value: T
}

export type Module = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
  uniforms: Record<string, Uniform>
}

export const module = (input: Partial<Module>): Module => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  uniforms: {},
  ...input
})

export const formatValue = (value: any) =>
  typeof value === "number" ? value.toFixed(5) : value

export const composableShader = () => {
  const modules = new Array<Module>()

  function addModule(module: Module) {
    modules.push(module)
  }

  function compileProgram(headers: string[], main: string[]) {
    return `
      ${headers.join("\n\n")}

      void main() {
        ${main.join("\n\n")}
      }
    `
  }

  function compile() {
    return {
      vertexShader: compileProgram(
        modules.map((m) => m.vertexHeader),
        modules.map((m) => `{ ${m.vertexMain} }`)
      ),

      fragmentShader: compileProgram(
        modules.map((m) => m.fragmentHeader),
        modules.map((m) => `{ ${m.fragmentMain} }`)
      ),

      uniforms: modules.reduce((acc, m) => ({ ...acc, ...m.uniforms }), {})
    }
  }

  return { addModule, compile }
}
