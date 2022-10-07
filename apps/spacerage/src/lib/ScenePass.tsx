import { ReactNode, useState } from "react"
import { Scene } from "three"
import * as RC from "render-composer"
import { createPortal } from "@react-three/fiber"

export const ScenePass = ({ children }: { children?: ReactNode }) => {
  const [scene] = useState(() => new Scene())

  return createPortal(
    <>
      {children}
      <RC.RenderPass clear={false} ignoreBackground />
      <RC.EffectPass />
    </>,
    scene,
    {}
  )
}
