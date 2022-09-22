import * as RAPIER from "@dimforge/rapier3d-compat"
import { useConst } from "@hmans/use-const"
import { useFrame } from "@react-three/fiber"
import React, { ReactNode, useContext } from "react"
import { useAsset } from "use-asset"
import { importRapier } from "./util/importRapier"

export type WorldProps = {
  children?: ReactNode
  updatePriority?: number
  gravity?: [number, number, number]
}

const WorldContext = React.createContext<{ world: RAPIER.World }>(null!)

export const World = ({
  children,
  gravity = [0, -9.81, 0],
  updatePriority
}: WorldProps) => {
  useAsset(importRapier)

  const world = useConst(() => new RAPIER.World(new RAPIER.Vector3(...gravity)))

  useFrame(() => {
    world.step()
  }, updatePriority)

  return (
    <WorldContext.Provider value={{ world }}>{children}</WorldContext.Provider>
  )
}

export const usePhysicsWorld = () => useContext(WorldContext)
