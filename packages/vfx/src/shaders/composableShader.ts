import { RenderCallback } from "@react-three/fiber"

export type Uniform<T = any> = {
  value: T
}

export type Attribute = {
  itemSize: number
}

export type Module = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
  uniforms: Record<string, Uniform>
  attributes: Record<string, Attribute>

  update?: RenderCallback
}

export const module = (input: Partial<Module>): Module => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  uniforms: {},
  attributes: {},
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
    const update: RenderCallback = (state, dt) =>
      modules.forEach((m) => m.update?.(state, dt))

    return {
      vertexShader: compileProgram(
        modules.map((m) => m.vertexHeader),
        modules.map((m) => `{ ${m.vertexMain} }`)
      ),

      fragmentShader: compileProgram(
        modules.map((m) => m.fragmentHeader),
        modules.map((m) => `{ ${m.fragmentMain} }`)
      ),

      uniforms: modules.reduce((acc, m) => ({ ...acc, ...m.uniforms }), {}),

      attributes: modules.reduce((acc, m) => ({ ...acc, ...m.attributes }), {}),

      update
    }
  }

  return { addModule, compile }
}
