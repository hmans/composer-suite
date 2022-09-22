import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import React, { ReactNode } from "react"
import { useAsset } from "use-asset"
import { importRapier } from "./util/importRapier"

export type WorldProps = {
  children?: ReactNode
}

export const World = ({ children }: WorldProps) => {
  useAsset(importRapier)

  const world = useConst(
    () => new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0))
  )

  return <>{children}</>
}
