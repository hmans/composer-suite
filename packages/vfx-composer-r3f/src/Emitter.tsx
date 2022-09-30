import { Object3DProps, useFrame } from "@react-three/fiber"
import React, {
  forwardRef,
  MutableRefObject,
  RefObject,
  useCallback,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Matrix4, Object3D } from "three"
import { MathUtils } from "three"
import { InstancedParticles, InstanceSetupCallback } from "vfx-composer"
import { DefaultContext, ParticlesContext } from "./context"
import { useFrameEffect } from "./lib/useFrameEffect"

export type EmitterProps = Object3DProps & {
  particles?:
    | MutableRefObject<InstancedParticles>
    | RefObject<InstancedParticles>
  limit?: number
  rate?: number | (() => number)
  setup?: InstanceSetupCallback
  context?: ParticlesContext
}

const tmpMatrix = new Matrix4()

export const Emitter = forwardRef<Object3D, EmitterProps>(
  (
    {
      particles: particlesProp,
      limit = Infinity,
      rate = 10,
      setup,
      context = DefaultContext,
      ...props
    },
    ref
  ) => {
    const origin = useRef<Object3D>(null!)
    const ctx = useContext(context)
    const queuedParticles = useRef(0)
    const remainingParticles = useRef(limit)
    const particlesMatrix = useRef(new Matrix4())

    if (rate === Infinity && limit === Infinity) {
      throw new Error(
        "Emitter: rate and limit cannot both be Infinity. Please set one of them to a finite value."
      )
    }

    const emitterSetup = useCallback<InstanceSetupCallback>(
      (props) => {
        /* Grab the emitter's world matrix */
        tmpMatrix.copy(origin.current.matrixWorld)
        /* Apply the inverted particle mesh's matrix */
        tmpMatrix.premultiply(particlesMatrix.current)
        /* Decompose the components into the props object */
        tmpMatrix.decompose(props.position, props.rotation, props.scale)

        /* Invoke the user's setup callback, if one was given */
        setup?.(props)
      },
      [setup]
    )

    /* When the particle material has changed, reset this emitter. (HMR) */
    useFrameEffect(
      () => {
        const particles = particlesProp?.current || ctx.particles
        return particles?.material
      },
      () => {
        remainingParticles.current = limit
      }
    )

    /* When the props change, reinitialize the emitter */
    useLayoutEffect(() => {
      queuedParticles.current = rate === Infinity ? Infinity : 0
      remainingParticles.current = limit
    }, [rate, limit])

    const emit = useCallback(
      (dt: number) => {
        if (remainingParticles.current <= 0) return

        /* Grab a reference to the particles mesh */
        const particles = particlesProp?.current || ctx.particles
        if (!particles) return

        /* Increase the accumulated number of particles we're supposed to emit. */
        if (rate !== Infinity) {
          const currentRate = typeof rate === "function" ? rate() : rate
          queuedParticles.current += dt * currentRate
        }

        /* Is it time to emit? */
        if (queuedParticles.current >= 1) {
          /* Determine the amount of particles to emit. Don't go over the number of
          remaining particles. */
          const amount = Math.min(
            Math.trunc(queuedParticles.current),
            remainingParticles.current
          )

          /* Emit! */
          particles.updateMatrixWorld()
          particlesMatrix.current.copy(particles.matrixWorld).invert()
          particles.emit(amount, emitterSetup)

          /* Update the remaining number of particles, and the accumulator. */
          queuedParticles.current -= amount
          remainingParticles.current -= amount
        }
      },
      [particlesProp, ctx?.particles, emitterSetup, rate, limit]
    )

    useFrame(function emitterUpdate(_, dt) {
      if (!rate) return
      emit(MathUtils.clamp(dt, 0, 0.1))
    })

    useImperativeHandle(ref, () => origin.current)

    return <object3D {...props} ref={origin} />
  }
)
