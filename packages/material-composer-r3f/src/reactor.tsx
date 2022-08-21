import { FC, useEffect, useMemo } from "react"
import * as Modules from "material-composer/modules"
import { Module, ModuleFactory, ModuleFactoryProps } from "vfx-composer/modules"
import { useMaterialContext } from "./ComposableMaterial"

type Modules = typeof Modules

const cache = new Map<string, ModuleComponent<any>>()

type ModuleComponentProps<K extends keyof Modules> = Parameters<Modules[K]>[0]

type ModuleComponent<K extends keyof Modules> = FC<ModuleComponentProps<K>>

type ModuleComponentProxy = {
  [K in keyof Modules]: Modules[K] extends (...args: any[]) => Module
    ? ModuleComponent<K>
    : never
}

const makeModuleComponent = <P extends ModuleFactoryProps>(
  fac: ModuleFactory<P>
) => (props: P) => {
  const module = useMemo(() => fac(props), [props])

  const { addModule, removeModule } = useMaterialContext()

  useEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])

  return null
}

export const ModuleReactor = new Proxy<ModuleComponentProxy>(
  {} as ModuleComponentProxy,
  {
    get<N extends keyof Modules>(target: any, name: N) {
      if (!cache.has(name)) {
        // @ts-ignore
        cache.set(name, makeModuleComponent(Modules[name]))
      }
      return cache.get(name)
    }
  }
)
