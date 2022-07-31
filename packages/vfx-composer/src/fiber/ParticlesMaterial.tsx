import { extend } from "@react-three/fiber"
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
  const particles = useRef<ParticlesMaterialImpl>(null!)

  useImperativeHandle(ref, () => particles.current)

  // @ts-ignore
  return <vfxComposerParticlesMaterial_ {...props} ref={particles} />
})
