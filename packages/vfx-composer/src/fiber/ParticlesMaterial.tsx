import { extend, useFrame } from "@react-three/fiber"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { iCSMProps } from "three-custom-shader-material"
import { ModulePipe } from "../modules"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../ParticlesMaterial"

extend({ VfxComposerParticlesMaterial_: ParticlesMaterialImpl })

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
    // @ts-ignore
    <vfxComposerParticlesMaterial_
      attach="material"
      {...props}
      ref={material}
    />
  )
})
