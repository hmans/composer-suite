import { ModuleFactory, ModuleFactoryProps } from "material-composer"
import { useMemo } from "react"
import { useDetectShallowChange } from "./lib/use-detect-shallow-change"
import { useModuleRegistration } from "./moduleRegistration"

export const moduleComponent =
  <P extends ModuleFactoryProps>(fac: ModuleFactory<P>) =>
  (props: P) => {
    const module = useMemo(() => {
      return fac(props)
    }, [useDetectShallowChange(props)])

    useModuleRegistration(module)

    return null
  }
