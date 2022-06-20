export type Module = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
}

export const module = (input: Partial<Module>): Module => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...input
})

export const formatValue = (value: any) =>
  typeof value === "number" ? value.toFixed(5) : value

export const composableShader = () => {
  const state = {
    vertexHeaders: new Array<string>(),
    vertexMain: new Array<string>(),
    fragmentHeaders: new Array<string>(),
    fragmentMain: new Array<string>()
  }

  const addModule = (module: Module) => {
    state.vertexHeaders.push(module.vertexHeader)
    state.vertexMain.push(`{ ${module.vertexMain} }`)
    state.fragmentHeaders.push(module.fragmentHeader)
    state.fragmentMain.push(`{ ${module.fragmentMain} }`)
  }

  const compileProgram = (headers: string[], main: string[]) => `
    ${headers.join("\n\n")}
    void main() {
      ${main.join("\n\n")}
    }
  `

  const compile = () => ({
    vertexShader: compileProgram(state.vertexHeaders, state.vertexMain),
    fragmentShader: compileProgram(state.fragmentHeaders, state.fragmentMain),
    uniforms: {
      u_time: { value: 0 },
      u_depth: { value: null },
      u_cameraNear: { value: 0 },
      u_cameraFar: { value: 1 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] }
    }
  })

  return { addModule, compile }
}
