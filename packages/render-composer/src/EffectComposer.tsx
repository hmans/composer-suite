import { useConst } from "@hmans/use-const"
import { MutableListAPI, useMutableList } from "@hmans/use-mutable-list"
import { useFrame, useThree } from "@react-three/fiber"
import { EffectComposer as EffectComposerImpl, Pass } from "postprocessing"
import React, { createContext, ReactNode, useLayoutEffect } from "react"
import { HalfFloatType } from "three"

export type EffectComposerProps = {
  children?: ReactNode
  updatePriority?: number
}

export const EffectComposerContext = createContext<MutableListAPI<Pass>>(null!)

export const EffectComposer = ({
  children,
  updatePriority = 1
}: EffectComposerProps) => {
  /* This list will contain all our render passes. */
  const passes = useMutableList<Pass>()

  /* Fetch some R3F state we'll need. */
  const gl = useThree((s) => s.gl)
  const size = useThree((s) => s.size)

  /* Create the composer. */
  const composer = useConst(() => {
    return new EffectComposerImpl(gl, {
      frameBufferType: HalfFloatType
    })
  })

  /* Rebuild passes when the list changes */
  useLayoutEffect(() => {
    // console.log("Version of passes was bumped, updating composer")

    for (const pass of passes.list) {
      composer.addPass(pass)
    }

    return () => {
      composer.removeAllPasses()
    }
  }, [passes.version])

  /* Resize composer on resolution change */
  useLayoutEffect(() => {
    composer.setSize(size.width, size.height)
  }, [size.width, size.height, composer])

  /* Render! */
  useFrame(function effectComposerRender(_, dt) {
    composer.render(dt)
  }, updatePriority)

  return (
    <EffectComposerContext.Provider value={passes}>
      {children}
    </EffectComposerContext.Provider>
  )
}
