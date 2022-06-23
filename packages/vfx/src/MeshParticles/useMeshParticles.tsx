import { MutableRefObject, useLayoutEffect, useMemo, useRef } from "react"
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
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
    return (count: number, setup?: SpawnSetup) => {
      /* Grab some stuff we need */
      const { material, geometry } = imesh.current
      const { shader } = material.__vfx
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
        shader.resetConfiguration!(imesh.current)
        setup?.(shader.configurator, i)
        shader.applyConfiguration!(imesh.current, cursor)

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
