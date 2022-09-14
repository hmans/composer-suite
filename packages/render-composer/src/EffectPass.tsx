import { MutableListAPI, useMutableList } from "@hmans/use-mutable-list"
import { useThree } from "@react-three/fiber"
import * as PP from "postprocessing"
import React, { createContext, ReactNode, useContext, useMemo } from "react"
import { EffectComposerContext } from "./EffectComposer"

export const EffectPassContext = createContext<MutableListAPI<PP.Effect>>(null!)

export type EffectPassProps = {
  children?: ReactNode
}

export const EffectPass = ({ children }: EffectPassProps) => {
  const camera = useThree((s) => s.camera)

  /* Use a mutable list of effects */
  const effects = useMutableList<PP.Effect>()

  /* Recreate the effect pass every time the effects change */
  const pass = useMemo(() => {
    console.log(effects.list)
    return new PP.EffectPass(camera, ...effects.list)
  }, [camera, effects.version])

  /* Register with effect composer */
  const { useItem } = useContext(EffectComposerContext)
  useItem(pass)

  return (
    <EffectPassContext.Provider value={effects}>
      {children}
    </EffectPassContext.Provider>
  )
}
