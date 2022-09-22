import { MutableListAPI, useMutableList } from "@hmans/use-mutable-list"
import { Module } from "material-composer"
import { createContext, useContext } from "react"

export const ModuleRegistrationContext = createContext<MutableListAPI<Module>>(
  null!
)

export const provideModuleRegistration = () => useMutableList<Module>()

export const useModuleRegistration = (module: Module) => {
  const api = useContext(ModuleRegistrationContext)
  api.useItem(module)
}
