import React, { ReactNode, useState } from "react"
import { Scene } from "three"
import { createPortal } from "@react-three/fiber"
import { RenderPass } from "./RenderPass"
import { EffectPass } from "./EffectPass"

export const ScenePass = ({ children }: { children?: ReactNode }) => {
  const [scene] = useState(() => new Scene())

  return createPortal(
    <>
      {children}
      <RenderPass clear={true} clearColor={false} ignoreBackground />
      <EffectPass />
    </>,
    scene,
    {}
  )
}
