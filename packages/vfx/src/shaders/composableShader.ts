export type Uniform<T = any> = {
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

      uniforms: {
        u_time: { value: 0 },
        u_depth: { value: null },
        u_cameraNear: { value: 0 },
        u_cameraFar: { value: 1 },
        u_resolution: { value: [window.innerWidth, window.innerHeight] }
      }
    }
  }

  return { addModule, compile }
}
