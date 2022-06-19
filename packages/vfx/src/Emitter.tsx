import { Object3DProps, useFrame } from "@react-three/fiber"
import React from "react"
import { SpawnSetup, useParticles } from "./MeshParticles"
import { getValue, ValueFactory } from "./util/ValueFactory"

export type EmitterProps = Object3DProps & {
  count?: ValueFactory<number>
  setup?: SpawnSetup
  continuous?: boolean
}

export const Emitter: React.FC<EmitterProps> = ({
  count = 0,
  setup,
  continuous = false,
  ...props
}) => {
  const { spawnParticle } = useParticles()

  React.useEffect(() => {
    if (continuous) return

    spawnParticle(getValue(count), setup)
  }, [])

  useFrame(() => {
    if (continuous) {
      spawnParticle(getValue(count), setup)
    }
  })

  return <object3D {...props} />
}
