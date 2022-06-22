import { RenderCallback } from "@react-three/fiber"
import { BufferGeometry } from "three"

export type Uniform<T = any> = {
  value: T
}

export type Attribute = {
  itemSize: number
}
export type Configurator = Record<string, any>

export type ConfiguratorCallback<C extends Configurator> = () => C

export type SetupCallback<C extends Configurator> = (
  geometry: BufferGeometry,
  index: number,
  configurator: C
) => void

export type Module<C extends Configurator> = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
  uniforms: Record<string, Uniform>
  attributes: Record<string, Attribute>

  configurator?: ConfiguratorCallback<C>
  setup?: SetupCallback<C>
  update?: RenderCallback
}

export type ComposedShader = {
  vertexShader: string
  fragmentShader: string
  uniforms: Record<string, Uniform>
  attributes: Record<string, Attribute>
  update: RenderCallback
}

export const module = <C extends Configurator>(
  input: Partial<Module<C>>
): Module<C> => ({
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
  const modules = new Array<Module<any>>()

  function addModule(module: Module<any>) {
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

  function compose(): ComposedShader {
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

  return { addModule, compose }
}
