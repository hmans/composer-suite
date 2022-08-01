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
import { Module } from "../modules"
import { VFXMaterial as VFXMaterialImpl, VFXMaterialArgs } from "../VFXMaterial"
import { useVersion } from "../util/useVersion"

const Context = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useVFXMaterialContext = () => useContext(Context)

export type VFXMaterialProps = iCSMProps

export const VFXMaterial = forwardRef<VFXMaterialImpl, VFXMaterialProps>(
  ({ children, ...props }, ref) => {
    const [version, bumpVersion] = useVersion()

    const [material] = useState(
      () => new VFXMaterialImpl(props as VFXMaterialArgs)
    )

    /* Dispose of the material on unmount, or when the material changes. */
    useEffect(() => () => material.dispose(), [material])

    /* Recompile on version change */
    useEffect(() => {
      material.compileModules()
    }, [version])

    const addModule = useCallback(
      (module: Module) => {
        material.modules = [...material.modules, module]
        bumpVersion()
      },
      [material]
    )

    const removeModule = useCallback(
      (module: Module) => {
        material.modules = material.modules.filter((m) => m !== module)
        bumpVersion()
      },
      [material]
    )

    /* Pass on the ref. */
    useImperativeHandle(ref, () => material)

    /* Run the material's per-frame tick. */
    useFrame((_, dt) => {
      material.tick(dt)
    })

    return (
      <primitive object={material} attach="material" {...props}>
        <Context.Provider value={{ addModule, removeModule }}>
          {children}
        </Context.Provider>
      </primitive>
    )
  }
)
