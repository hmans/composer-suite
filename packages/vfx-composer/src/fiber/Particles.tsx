import {
  extend,
  InstancedMeshProps,
  Node,
  Object3DNode
} from "@react-three/fiber"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { Particles as ParticlesImpl } from "../Particles"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particles: Object3DNode<ParticlesImpl, typeof ParticlesImpl>
    }
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    particles: Object3DNode<ParticlesImpl, typeof ParticlesImpl>
  }
}

extend({ Particles: ParticlesImpl })

export type ParticlesProps = InstancedMeshProps

export const Particles = forwardRef<ParticlesImpl, ParticlesProps>(
  (props, ref) => {
    const particles = useRef<ParticlesImpl>(null!)

    useImperativeHandle(ref, () => particles.current)

    // @ts-ignore
    return <particles {...props} ref={particles} />
  }
)
