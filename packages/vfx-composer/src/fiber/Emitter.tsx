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
import { Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { InstanceSetupCallback, Particles } from "../Particles"
import { useParticlesContext } from "./Particles"

export type EmitterProps = Object3DProps & {
  particles?: MutableRefObject<Particles> | RefObject<Particles>
  count?: number
  continuous?: boolean
  setup?: InstanceSetupCallback
}

const tmpMatrix = new Matrix4()
const particlesMatrix = new Matrix4()

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
        tmpMatrix
          .copy(object.current.matrixWorld)
          .premultiply(particlesMatrix)
          .decompose(props.position, props.rotation, props.scale)

        setup?.(props)
      },
      [particles, setup]
    )

    useEffect(() => {
      if (!particles) return
      if (continuous) return
      particlesMatrix.copy(particles!.matrixWorld).invert()
      particles.emit(count, emitterSetup)
    }, [particles])

    useFrame(() => {
      if (!particles) return
      if (!continuous) return
      particlesMatrix.copy(particles!.matrixWorld).invert()
      particles.emit(count, emitterSetup)
    })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
