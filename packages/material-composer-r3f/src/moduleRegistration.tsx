import { Module } from "material-composer"
import { createContext, useContext, useLayoutEffect } from "react"
import { MutableListAPI, useMutableList } from "@hmans/use-mutable-list"

export const ModuleRegistrationContext = createContext<MutableListAPI<Module>>(
  null!
)

export const provideModuleRegistration = () => useMutableList<Module>()

export const useModuleRegistration = (module: Module) => {
  const api = useContext(ModuleRegistrationContext)

  /*
  Every time the module changes, bump the version of the list.
  */
  useLayoutEffect(() => {
    api.bumpVersion()
    return () => api.bumpVersion()
  }, [module])

  /*
  Only ever mutate the lists on a version change. This guarantees that we
  will do it sequentially.
  */
  useLayoutEffect(() => {
    if (!module) return

    api.addItem(module)
    return () => api.removeItem(module)
  }, [api.version])
}
