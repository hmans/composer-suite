import { extend, useFrame } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react"
import { iCSMProps } from "three-custom-shader-material"
import { ModulePipe } from "../modules"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../ParticlesMaterial"

extend({ VfxComposerParticlesMaterial_: ParticlesMaterialImpl })

const Context = createContext<ParticlesMaterialImpl>(null!)

export type ParticlesMaterialProps = iCSMProps & { modules: ModulePipe }

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>((props, ref) => {
  const material = useRef<ParticlesMaterialImpl>(null!)

  useFrame((_, dt) => {
    material.current.tick(dt)
  })

  useImperativeHandle(ref, () => material.current)

  return (
    <vfxComposerParticlesMaterial_ attach="material" {...props} ref={material}>
      <Context.Provider value={material.current}>
        {props.children}
      </Context.Provider>
    </vfxComposerParticlesMaterial_>
  )
})
