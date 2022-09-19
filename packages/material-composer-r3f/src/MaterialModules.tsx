import { useConst } from "@hmans/use-const"
import { useInstanceHandle } from "@react-three/fiber"
import { compileModules, patchMaterial } from "material-composer"
import React, { useLayoutEffect, useMemo, useRef } from "react"
import { useShader } from "shader-composer-r3f"
import { Material } from "three"
import { materialShaderRoots } from "./composable"
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

  /* Hook into r3f internals to get the parent */
  const object = useConst(() => ({}))
  const ref = useRef()
  const instance = useInstanceHandle(ref)

  useLayoutEffect(() => {
    console.log("COMPILING")
    const parent = instance.current.parent as unknown

    if (!parent)
      throw new Error("MaterialModules must be a child of a material")

    const material = parent as Material

    patchMaterial(material, shader)

    materialShaderRoots.set(material, root)
    return () => void materialShaderRoots.delete(material)
  }, [root, shader])

  return (
    <primitive object={object} ref={ref}>
      <ModuleRegistrationContext.Provider value={modules}>
        {children}
      </ModuleRegistrationContext.Provider>
    </primitive>
  )
}
