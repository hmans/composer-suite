import { Module } from "../shaders"
import billboarding from "../shaders/billboarding"
import colors from "../shaders/colors"
import easings from "../shaders/easings"
import lifetime from "../shaders/lifetime"
import movement from "../shaders/movement"
import scale from "../shaders/scale"
import softparticles from "../shaders/softparticles"
import time from "../shaders/time"

const compile = (headers: string[], main: string[]) => `
  ${headers.join("\n\n")}
  void main() {
    ${main.join("\n\n")}
  }
`

type ShaderProps = {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
}

export const createShader = ({
  billboard = false,
  softness = 0,
  scaleFunction,
  colorFunction,
  softnessFunction
}: ShaderProps = {}) => {
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

  addModule(easings())
  addModule(time())
  addModule(lifetime())
  billboard && addModule(billboarding())
  addModule(scale(scaleFunction))
  addModule(movement())
  addModule(colors(colorFunction))
  softness && addModule(softparticles(softness, softnessFunction))

  return {
    vertexShader: compile(state.vertexHeaders, state.vertexMain),
    fragmentShader: compile(state.fragmentHeaders, state.fragmentMain),
    uniforms: {
      u_time: { value: 0 },
      u_depth: { value: null },
      u_cameraNear: { value: 0 },
      u_cameraFar: { value: 1 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] }
    }
  }
}
