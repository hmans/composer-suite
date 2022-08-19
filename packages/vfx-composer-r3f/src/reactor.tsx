import { FC, useEffect, useMemo } from "react"
import * as VFXModules from "vfx-composer/modules"
import { Module, ModuleFactory, ModuleFactoryProps } from "vfx-composer/modules"
import { useVFXMaterialContext } from "./VFXMaterial"
type VFXModules = typeof VFXModules

const cache = new Map<string, VFXComponent<any>>()

type VFXComponentProps<K extends keyof VFXModules> = Parameters<
  VFXModules[K]
>[0]

type VFXComponent<K extends keyof VFXModules> = FC<VFXComponentProps<K>>

type VFXProxy = {
  [K in keyof VFXModules]: VFXModules[K] extends (...args: any[]) => Module
    ? VFXComponent<K>
    : never
}

const makeModuleComponent = <P extends ModuleFactoryProps>(
  fac: ModuleFactory<P>
) => (props: P) => {
  const module = useMemo(() => fac(props), [props])

  const { addModule, removeModule } = useVFXMaterialContext()

  useEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])

  return null
}

export const VFXReactor = new Proxy<VFXProxy>({} as VFXProxy, {
  get<N extends keyof VFXModules>(target: any, name: N) {
    if (!cache.has(name)) {
      // @ts-ignore
      cache.set(name, makeModuleComponent(VFXModules[name]))
    }
    return cache.get(name)
  }
})
