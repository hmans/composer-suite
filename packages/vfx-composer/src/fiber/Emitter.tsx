import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Object3D } from "three"
import { InstanceSetupCallback, Particles } from "../Particles"

export type EmitterProps = Object3DProps & {
  particles: MutableRefObject<Particles>
  count?: number
  continuous?: boolean
  setup?: InstanceSetupCallback
}

export const Emitter = forwardRef<Object3D, EmitterProps>(
  ({ particles, count = 1, continuous = false, setup, ...props }, ref) => {
    const object = useRef<Object3D>(null!)

    useEffect(() => {
      if (continuous) return
      particles.current.emit(count, setup)
    }, [])

    useFrame(() => {
      if (continuous) {
        particles.current.emit(count, setup)
      }
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
