import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  MutableRefObject,
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef
} from "react"
import { Matrix4, Object3D } from "three"
import { InstanceSetupCallback, Particles } from "vfx-composer"
import { useParticlesContext } from "./Particles"

export type EmitterProps = Object3DProps & {
  particles?: MutableRefObject<Particles> | RefObject<Particles>
  limit?: number
  rate?: number
  duration?: number
  setup?: InstanceSetupCallback
}

const tmpMatrix = new Matrix4()
const particlesMatrix = new Matrix4()

export const Emitter = forwardRef<Object3D, EmitterProps>(
  (
    { particles: particlesProp, limit = Infinity, rate = 10, setup, ...props },
    ref
  ) => {
    const origin = useRef<Object3D>(null!)
    const particlesFromContext = useParticlesContext()
    const acc = useRef(0)
    const remaining = useRef(limit)

    if (rate === Infinity && limit === Infinity) {
      throw new Error(
        "Emitter: rate and limit cannot both be Infinity. Please set one of them to a finite value."
      )
    }

    const emitterSetup = useCallback<InstanceSetupCallback>(
      (props) => {
        tmpMatrix
          .copy(origin.current.matrixWorld)
          .premultiply(particlesMatrix)
          .decompose(props.position, props.rotation, props.scale)

        setup?.(props)
      },
      [setup]
    )

    const emit = useCallback(
      (dt: number) => {
        if (remaining.current <= 0) return

        /* Grab a reference to the particles mesh */
        const particles = particlesProp?.current || particlesFromContext
        if (!particles) return

        /* Increase the accumulated number of particles we're supposed to emit. */
        acc.current += dt * rate

        /* Is it time to emit? */
        if (acc.current >= 1) {
          /* Determine the amount of particles to emit. Don't go over the number of
          remaining particles. */
          const amount = Math.min(Math.trunc(acc.current), remaining.current)

          /* Emit! */
          particlesMatrix.copy(particles.matrixWorld).invert()
          particles.emit(amount, emitterSetup)

          /* Update the remaining number of particles, and the accumulator. */
          acc.current -= amount
          remaining.current -= amount
        }
      },
      [particlesProp, particlesFromContext, emitterSetup]
    )

    useFrame((_, dt) => {
      if (!rate) return
      emit(dt)
    })

    useImperativeHandle(ref, () => origin.current)

    return <object3D {...props} ref={origin} />
  }
)
