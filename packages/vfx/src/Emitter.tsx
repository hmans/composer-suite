import { Object3DProps, useFrame } from "@react-three/fiber"
import React, { useEffect, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { Object3D } from "three"
import { SpawnSetup, useParticles } from "./ParticlesContext"
import { getValue, ValueFactory } from "./util/ValueFactory"

export type EmitterProps = Object3DProps & {
  count?: ValueFactory<number>
  setup?: SpawnSetup
  continuous?: boolean
}

export const Emitter = React.forwardRef<Object3D, EmitterProps>(
  ({ count = 0, setup, continuous = false, ...props }, ref) => {
    const { spawnParticle } = useParticles()
    const object = useRef<Object3D>(null!)

    useEffect(() => {
      if (continuous) return
      spawnParticle(getValue(count), setup, object.current)
    }, [])

    useFrame(() => {
      if (continuous) {
        spawnParticle(getValue(count), setup, object.current)
      }
    })

    return <object3D {...props} ref={mergeRefs([ref, object])} />
  }
)
