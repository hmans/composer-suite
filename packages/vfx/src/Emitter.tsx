import { Object3DProps } from "@react-three/fiber"
import { FC, useEffect } from "react"
import { SpawnSetup, useParticles } from "./MeshParticles"
import { getValue, ValueFactory } from "./ValueFactory"

export type EmitterProps = Object3DProps & {
  count?: ValueFactory<number>
  setup?: SpawnSetup
}

export const Emitter: FC<EmitterProps> = ({ count = 0, setup, ...props }) => {
  const { spawnParticle } = useParticles()

  useEffect(() => {
    spawnParticle(getValue(count), setup)
  }, [])

  return <object3D {...props} />
}
