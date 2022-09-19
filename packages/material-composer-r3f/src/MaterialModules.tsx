import { useConst } from "@hmans/use-const"
import { useInstanceHandle } from "@react-three/fiber"
import { compileModules } from "material-composer"
import React, { useLayoutEffect, useMemo, useRef } from "react"
import { useShader } from "shader-composer-r3f"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"

export type MaterialModulesProps = {
  children?: React.ReactNode
}

export const MaterialModules = ({ children }: MaterialModulesProps) => {
  const modules = provideModuleRegistration()
  const root = useMemo(() => compileModules(modules.list), [modules.version])
  const shader = useShader(() => root, [root])

  const object = useConst(() => ({}))
  const ref = useRef()
  const instance = useInstanceHandle(ref)

  useLayoutEffect(() => {
    console.log(instance.current.parent)
  }, [])

  return (
    <primitive object={object} ref={ref}>
      <ModuleRegistrationContext.Provider value={modules}>
        {children}
      </ModuleRegistrationContext.Provider>
    </primitive>
  )
}
