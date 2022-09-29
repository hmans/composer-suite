import { useConst } from "@hmans/use-const"
import React, { createContext, ReactNode } from "react"
import * as THREE from "three"

export const AudioNodeContext = createContext<AudioNode>(null!)

export type AudioContextProps = {
  children?: ReactNode
}

export const AudioContext = ({ children }: AudioContextProps) => {
  const context = useConst(() => THREE.AudioContext.getContext())

  return (
    <AudioNodeContext.Provider value={context.destination}>
      {children}
    </AudioNodeContext.Provider>
  )
}
