import { useFrame } from "@react-three/fiber"
import {
  compileShader,
  GLSLType,
  JSTypes,
  UniformUnit,
  Unit,
  UnitConfig
} from "@shader-composer/core"
import { useEffect, useLayoutEffect, useMemo } from "react"

export const useShader = (ctor: () => Unit, deps?: any) => {
  const [shader, { update, dispose }] = useMemo(
    () => compileShader(ctor()),
    deps
  )

  /* Dispose of the shader on unmount */
  useEffect(() => () => dispose(), deps)

  /* Invoke the shader tree's update functions. */
  useFrame(function useShaderUpdate({ clock, camera, scene, gl }, dt) {
    update({ dt, time: clock.oldTime }, { camera, scene, gl })
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
