import { useConst } from "@hmans/use-const"
import { useFrame, useThree } from "@react-three/fiber"
import { EffectComposer as EffectComposerImpl } from "postprocessing"
import React, { ReactNode } from "react"
import { HalfFloatType } from "three"

export type EffectComposerProps = {
  children?: ReactNode
  updatePriority?: number
}

export const EffectComposer = ({
  children,
  updatePriority = 1
}: EffectComposerProps) => {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)

  const composer = useConst(() => {
    return new EffectComposerImpl(gl, {
      frameBufferType: HalfFloatType
    })
  })

  useFrame((_, dt) => {
    composer.render(dt)
  }, updatePriority)

  return <>{children}</>
}
