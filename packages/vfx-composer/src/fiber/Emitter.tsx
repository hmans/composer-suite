import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Object3D } from "three"
import { InstanceSetupCallback, Particles } from "../Particles"
import { useParticlesContext } from "./Particles"

export type EmitterProps = Object3DProps & {
  particles?: MutableRefObject<Particles> | RefObject<Particles>
  count?: number
  continuous?: boolean
  setup?: InstanceSetupCallback
}

export const Emitter = forwardRef<Object3D, EmitterProps>(
  (
    {
      particles: particlesProp,
      count = 1,
      continuous = false,
      setup,
      ...props
    },
    ref
  ) => {
    const object = useRef<Object3D>(null!)
    const particles = particlesProp?.current || useParticlesContext()

    useEffect(() => {
      if (!particles) return
      if (continuous) return
      particles.emit(count, setup)
    }, [particles])

    useFrame(() => {
      if (!particles) return
      if (!continuous) return
      particles.emit(count, setup)
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
