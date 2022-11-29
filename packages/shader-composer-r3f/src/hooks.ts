import { useFrame } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo } from "react"
import {
  compileShader,
  GLSLType,
  JSTypes,
  UniformUnit,
  Unit,
  UnitConfig
} from "shader-composer"

export const useShader = (ctor: () => Unit, deps?: any) => {
  const [shader, { update, dispose }] = useMemo(
    () => compileShader(ctor()),
    deps
  )

  /* Dispose of the shader on unmount */
  useEffect(() => () => dispose(), deps)

  /* Invoke the shader tree's update functions. */
  useFrame(function useShaderUpdate(_, dt) {
    update(dt)
  })

  return shader
}

export const useUniformUnit = <T extends GLSLType>(
  type: T,
  value: JSTypes[T],
  config?: Partial<UnitConfig<T>>
) => {
  const uniform = useMemo(() => {
    return UniformUnit(type, value, config)
  }, [])

  useLayoutEffect(() => {
    uniform.value = value
  }, [value])

  return uniform
}
