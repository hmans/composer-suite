import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Object3D } from "three"
import { useParticlesAPI } from "./Particles"
import { ParticleSetupCallback } from "./useParticles"

export type EmitterProps = Object3DProps & {
  count?: number
  continuous?: boolean
  setup?: ParticleSetupCallback
}

export const Emitter = forwardRef<Object3D, EmitterProps>(
  ({ count = 0, continuous = false, setup, ...props }, ref) => {
    const { spawn } = useParticlesAPI()
    const object = useRef<Object3D>(null!)

    useEffect(() => {
      if (continuous) return
      spawn(count, { setup })
    }, [])

    useFrame(() => {
      if (continuous) {
        spawn(count, { setup })
      }
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
