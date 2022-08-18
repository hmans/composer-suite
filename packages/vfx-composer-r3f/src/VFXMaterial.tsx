import { extend, useFrame, useThree } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { iCSMProps } from "three-custom-shader-material"
import { VFXMaterial as VFXMaterialImpl } from "vfx-composer"
import { Module } from "vfx-composer/modules"
import { useVersion } from "./util/useVersion"

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
    const scene = useThree((s) => s.scene)
    const camera = useThree((s) => s.camera)
    const renderer = useThree((s) => s.gl)

    const material = useRef<VFXMaterialImpl>(null!)
    const [version, bumpVersion] = useVersion()

    /* Recompile on version change */
    useEffect(() => {
      material.current.compileModules()
    }, [version])

    const addModule = useCallback((module: Module) => {
      if (!material.current) return
      material.current.modules = [...material.current.modules, module]
      bumpVersion()
    }, [])

    const removeModule = useCallback((module: Module) => {
      if (!material.current) return
      material.current.modules = material.current.modules.filter(
        (m) => m !== module
      )
      bumpVersion()
    }, [])

    /* Pass on the ref. */
    useImperativeHandle(ref, () => material.current)

    /* Run the material's per-frame tick. */
    useFrame((_, dt) => {
      material.current.tick(dt, camera, scene, renderer)
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
