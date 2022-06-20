import * as modules from "../shaders/modules"
import { composableShader } from "../shaders/composableShader"

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
  const { addModule, compile } = composableShader()

  addModule(modules.easings())
  addModule(modules.time())
  addModule(modules.lifetime())
  billboard && addModule(modules.billboarding())
  addModule(modules.scale(scaleFunction))
  addModule(modules.movement())
  addModule(modules.colors(colorFunction))
  softness && addModule(modules.softparticles(softness, softnessFunction))

  return compile()
}
