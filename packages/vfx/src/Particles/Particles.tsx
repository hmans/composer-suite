import { InstancedMeshProps } from "@react-three/fiber"
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
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
  ShaderMaterial,
  Vector3
} from "three"
import { ParticlesContext } from "../ParticlesContext"

export type ParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type Particles = InstancedMesh<InstancedBufferGeometry, ShaderMaterial>

export const Particles = forwardRef<Particles, ParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    const maxInstanceCount = maxParticles + safetySize
    const imesh = useRef<Particles>(null!)

    useLayoutEffect(() => {
      /* Prepare geometry */
      const { geometry } = imesh.current

      geometry.setAttribute(
        "lifetime",
        new InstancedBufferAttribute(new Float32Array(maxInstanceCount * 2), 2)
      )

      geometry.setAttribute(
        "velocity",
        new InstancedBufferAttribute(new Float32Array(maxInstanceCount * 3), 3)
      )
    }, [])

    const spawnParticle = useMemo(() => {
      /* The cursor automatically advances every time a new particle is spawned. */
      let cursor = 0

      /* This function will spawn new particles. */
      return (count: number) => {
        console.log("spawning", count)

        /* Grab some stuff we need */
        const { material, geometry } = imesh.current

        const time = material.uniforms.u_time.value

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
          /* Initialize new particle */
          imesh.current.setMatrixAt(cursor, new Matrix4())

          /* Configure lifetime */
          geometry.attributes.lifetime.setXY(
            cursor,
            time,
            time + 0.5 + Math.random()
          )

          /* Configure velocity */
          geometry.attributes.velocity.setXYZ(
            cursor,
            ...new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10,
              Math.random() * 10 - 5
            ).toArray()
          )

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

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref])}
        args={[geometry, undefined, maxParticles + safetySize]}
        {...props}
      >
        <ParticlesContext.Provider value={{ spawnParticle }}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
