import { useFrame } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from "react"
import { iCSMProps } from "three-custom-shader-material"
import { Module, ModulePipe } from "../modules"
import { VFXMaterial as VFXMaterialImpl, VFXMaterialArgs } from "../VFXMaterial"

const Context = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useVFXMaterialContext = () => useContext(Context)

export type VFXMaterialProps = iCSMProps

export const VFXMaterial = forwardRef<VFXMaterialImpl, VFXMaterialProps>(
  ({ children, ...props }, ref) => {
    const [modules, setModules] = useState<ModulePipe>([])
    const [version, setVersion] = useState(0)

    const [material] = useState(
      () => new VFXMaterialImpl(props as VFXMaterialArgs)
    )

    /* Run the material's per-frame tick. */
    useFrame((_, dt) => {
      material.tick(dt)
    })

    /* Update the material's modules (leading to a recompilation of the shader)
    when they change. */
    useEffect(() => {
      material.modules = modules
    }, [modules])

    /* Dispose of the material on unmount, or when the material changes. */
    useEffect(() => () => material.dispose(), [material])

    /* Pass on the ref. */
    useImperativeHandle(ref, () => material)

    /* Recompile on version change */
    useEffect(() => {
      material.compileModules()
    }, [version])

    const addModule = useCallback(
      (module: Module) => {
        setModules((modules) => [...modules, module])
        setVersion((v) => v + 1)
      },
      [material]
    )

    const removeModule = useCallback(
      (module: Module) => {
        setModules((modules) => modules.filter((m) => m !== module))
        setVersion((v) => v + 1)
      },
      [material]
    )

    return (
      <primitive object={material} attach="material" {...props}>
        <Context.Provider value={{ addModule, removeModule }}>
          {children}
        </Context.Provider>
      </primitive>
    )
  }
)
