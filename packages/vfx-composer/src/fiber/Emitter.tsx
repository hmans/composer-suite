import { Object3DProps, useFrame } from "@react-three/fiber"
import { Instance } from "@react-three/fiber/dist/declarations/src/core/renderer"
import React, {
  forwardRef,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { Matrix4, Object3D } from "three"
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

    const emitterSetup = useCallback<InstanceSetupCallback>(
      (props) => {
        const m4 = new Matrix4()

        /* TODO: do the same for rotation and scale, too */
        object.current.getWorldPosition(props.position)
        particles!.worldToLocal(props.position)

        setup?.(props)
      },
      [particles, setup]
    )

    useEffect(() => {
      if (!particles) return
      if (continuous) return
      particles.emit(count, emitterSetup)
    }, [particles])

    useFrame(() => {
      if (!particles) return
      if (!continuous) return
      particles.emit(count, emitterSetup)
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
