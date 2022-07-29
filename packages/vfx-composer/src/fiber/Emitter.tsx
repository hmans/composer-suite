import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle
} from "react"
import { Object3D } from "three"
import { useParticlesAPI } from "../Particles"

export type EmitterProps = Object3DProps & {
  count?: number
  continuous?: boolean
}

export const Emitter = forwardRef<Object3D, EmitterProps>(
  ({ count = 0, continuous = false, ...props }, ref) => {
    const { spawn } = useParticlesAPI()
    const object = useRef<Object3D>(null!)

    useEffect(() => {
      if (continuous) return
      spawn(count)
    }, [])

    useFrame(() => {
      if (continuous) {
        spawn(count)
      }
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
