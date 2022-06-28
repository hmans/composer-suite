import { InstancedMeshProps, useThree } from "@react-three/fiber"
import React, {
  forwardRef,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import mergeRefs from "react-merge-refs"
import {
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { ParticlesContext, SpawnSetup } from "../ParticlesContext"

export type Particles = InstancedMesh

export type ParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export const Particles = forwardRef<Particles, ParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    /* The safetySize allows us to emit a batch of particles that would otherwise
     exceed the maximum instance count (which would make WebGL crash.) This way, we don't
     have to upload the entirety of all buffers every time the playhead wraps back to 0. */
    const maxInstanceCount = maxParticles + safetySize
    const imesh = useRef<Particles>(null!)

    const { clock } = useThree()

    useLayoutEffect(() => {
      /* TODO: prepare mesh! */
      // prepareInstancedMesh(
      //   imesh.current,
      //   imesh.current.material.__vfx.shader,
      //   maxInstanceCount
      // )

      imesh.current.geometry.setAttribute(
        "lifetime",
        new InstancedBufferAttribute(new Float32Array(maxInstanceCount * 2), 2)
      )

      imesh.current.geometry.setAttribute(
        "velocity",
        new InstancedBufferAttribute(new Float32Array(maxInstanceCount * 3), 3)
      )
    }, [])

    const spawnParticle = useMemo(() => {
      /* The cursor automatically advances every time a new particle is spawned. */
      let cursor = 0

      /* This function will spawn new particles. */
      return (count: number, setup?: SpawnSetup) => {
        /* Grab some stuff we need */
        const { material, geometry } = imesh.current
        // const { shader } = material.__vfx
        const attributes = geometry.attributes as Record<
          string,
          InstancedBufferAttribute
        >

        /*
         Safety check: if we've reached the end of the buffers, it means the user picked a safety
         size too small for their use case. We don't want to crash the application, so let's log a
         warning and discard the particle.
         */
        if (cursor + count > maxInstanceCount) {
          console.warn(
            "Spawned too many particles this frame. Discarding. Consider increasing the safetySize."
          )

          return
        }

        /* Configure the attributes to upload only the updated parts to the GPU. */
        const allAttributes = [
          imesh.current.instanceMatrix,
          ...Object.values(attributes)
        ]

        allAttributes.forEach((attribute) => {
          attribute.needsUpdate = true
          attribute.updateRange.offset = cursor * attribute.itemSize
          attribute.updateRange.count = count * attribute.itemSize
        })

        /* Spawn particles, yay! */
        for (let i = 0; i < count; i++) {
          // TODO: move this stuff somewhere else

          /* Spawn a single particle */
          imesh.current.setMatrixAt(
            cursor,
            new Matrix4().compose(
              new Vector3(),
              new Quaternion().identity(),
              new Vector3(1, 1, 1)
            )
          )

          imesh.current.geometry.attributes.lifetime.setXY(
            cursor,
            clock.elapsedTime,
            clock.elapsedTime + 1
          )

          imesh.current.geometry.attributes.velocity.setXYZ(
            cursor,
            ...new Vector3()
              .randomDirection()
              .multiplyScalar(Math.random() * 5)
              .toArray()
          )

          /* Initialize new particle */
          // shader.resetConfig!(imesh.current)
          // setup?.(shader.config, i)
          // shader.applyConfig!(imesh.current, cursor)

          /* Advance playhead */
          cursor++
        }

        /* Increase count of imesh to match playhead */
        if (cursor > imesh.current.count) {
          imesh.current.count = cursor
        }

        /* If we've gone past the number of max particles, reset the playhead. */
        if (cursor > maxParticles) {
          cursor = 0
        }
      }
    }, [])

    const api = useMemo(() => ({ spawnParticle }), [spawnParticle])

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref])}
        args={[geometry, undefined, maxParticles + safetySize]}
        {...props}
      >
        <ParticlesContext.Provider value={api}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
