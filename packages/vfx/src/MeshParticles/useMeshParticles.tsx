import { MutableRefObject, useLayoutEffect, useMemo, useRef } from "react"
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
  Object3D,
  Vector3
} from "three"
import { components, ParticlesAPI, SpawnSetup } from "../ParticlesContext"
import { MeshParticlesMaterial } from "./MeshParticlesMaterial"
import { setupInstancedMesh } from "./setupInstancedMesh"

export const tmpScale = new Vector3()
export const tmpMatrix4 = new Matrix4()

export type MeshParticles = InstancedMesh<
  InstancedBufferGeometry,
  MeshParticlesMaterial
>

export function useMeshParticles(
  maxParticles: number,
  safetySize: number
): [MutableRefObject<MeshParticles>, ParticlesAPI] {
  /* The safetySize allows us to emit a batch of particles that would otherwise
     exceed the maximum instance count (which would make WebGL crash.) This way, we don't
     have to upload the entirety of all buffers every time the playhead wraps back to 0. */
  const maxInstanceCount = maxParticles + safetySize
  const imesh = useRef<MeshParticles>(null!)

  useLayoutEffect(() => {
    setupInstancedMesh(imesh.current, maxInstanceCount)
  }, [])

  const spawnParticle = useMemo(() => {
    /* The cursor automatically advances every time a new particle is spawned. */
    let cursor = 0

    /* This function will spawn new particles. */
    return (count: number, setup?: SpawnSetup, origin?: Object3D) => {
      /* Grab some stuff we need */
      const { material, geometry } = imesh.current
      const { shader } = material.__vfx
      const attributes = geometry.attributes as Record<
          string,
          InstancedBufferAttribute
        >

        /* Configure the attributes to upload only the updated parts to the GPU. */
      ;[imesh.current.instanceMatrix, ...Object.values(attributes)].forEach(
        (attribute) => {
          attribute.needsUpdate = true
          attribute.updateRange.offset = cursor * attribute.itemSize
          attribute.updateRange.count = count * attribute.itemSize
        }
      )

      /* For every spawned particle, write some data into the attribute buffers. */
      for (let i = 0; i < count; i++) {
        /* Safety check: if we've reached the end of the buffers, it means the user picked a safety
           size too small for their use case. We don't want to crash the application, so let's log a
           warning and discard the particle. */
        if (cursor >= maxInstanceCount) {
          console.warn(
            "Spawned too many particles this frame. Discarding. Consider increasing the safetySize."
          )

          return
        }

        /* Initialize components */
        components.position.set(0, 0, 0)
        components.quaternion.set(0, 0, 0, 1)
        components.velocity.set(0, 0, 0)
        components.acceleration.set(0, 0, 0)
        components.scale[0].set(1, 1, 1)
        components.scale[1].set(1, 1, 1)
        components.delay = 0
        components.lifetime = 1
        components.color[0].setRGB(1, 1, 1)
        components.color[1].setRGB(1, 1, 1)
        components.alpha = [1, 0]

        /* Run the setup function, when available */
        setup?.(components, i)

        /* First of all, write the particle's starting transform into the instance buffer. */
        imesh.current.setMatrixAt(
          cursor,
          tmpMatrix4.compose(
            components.position,
            components.quaternion,
            tmpScale.setScalar(1)
          )
        )

        /* Set times */
        const currentTime = imesh.current.material.uniforms.u_time.value
        attributes.time.setXY(
          cursor,
          currentTime + components.delay,
          currentTime + components.lifetime
        )

        /* Set velocity */
        attributes.velocity.setXYZ(cursor, ...components.velocity.toArray())

        /* Set acceleration */
        attributes.acceleration.setXYZ(
          cursor,
          ...components.acceleration.toArray()
        )

        /* Set color */
        attributes.color0.setXYZW(
          cursor,
          components.color[0].r,
          components.color[0].g,
          components.color[0].b,
          components.alpha[0]
        )
        attributes.color1.setXYZW(
          cursor,
          components.color[1].r,
          components.color[1].g,
          components.color[1].b,
          components.alpha[1]
        )

        /* Set scale */
        attributes.scale0.setXYZ(cursor, ...components.scale[0].toArray())
        attributes.scale1.setXYZ(cursor, ...components.scale[1].toArray())

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

  return [imesh, { spawnParticle }]
}
