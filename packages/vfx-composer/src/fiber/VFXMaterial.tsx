import { extend, useFrame } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
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

extend({ VfxComposerVFXMaterial: VFXMaterialImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      vfxComposerVFXMaterial: VFXMaterialProps
    }
  }
}

export const VFXMaterial = forwardRef<VFXMaterialImpl, VFXMaterialProps>(
  ({ children, ...props }, ref) => {
    const material = useRef<VFXMaterialImpl>(null!)
    const [version, bumpVersion] = useVersion()

    /* Recompile on version change */
    useEffect(() => {
      if (!material.current) return
      material.current.compileModules()
    }, [version])

    const addModule = useCallback(
      (module: Module) => {
        if (!material.current) return
        material.current.modules = [...material.current.modules, module]
        bumpVersion()
      },
      [material]
    )

    const removeModule = useCallback(
      (module: Module) => {
        if (!material.current) return
        material.current.modules = material.current.modules.filter(
          (m) => m !== module
        )
        bumpVersion()
      },
      [material]
    )

    /* Pass on the ref. */
    useImperativeHandle(ref, () => material.current)

    /* Run the material's per-frame tick. */
    useFrame((_, dt) => {
      if (!material.current) return
      material.current.tick(dt)
    })

    return (
      // @ts-ignore
      <vfxComposerVFXMaterial attach="material" ref={material} {...props}>
        <Context.Provider value={{ addModule, removeModule }}>
          {children}
        </Context.Provider>
      </vfxComposerVFXMaterial>
    )
  }
)
