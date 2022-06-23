import { MutableRefObject, useLayoutEffect, useMemo, useRef } from "react"
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
  Object3D,
  Vector3
} from "three"
import { ParticlesAPI, SpawnSetup } from "../ParticlesContext"
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
        const config = shader.configurator
        shader.reset?.(imesh.current)
        setup?.(config, i)
        shader.apply?.(imesh.current, cursor)

        /* Set times */
        const currentTime = imesh.current.material.uniforms.u_time.value
        attributes.time.setXY(
          cursor,
          currentTime + config.delay,
          currentTime + config.lifetime
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

  return [imesh, { spawnParticle }]
}
