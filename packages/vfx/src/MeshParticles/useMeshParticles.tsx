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
        config.position.set(0, 0, 0)
        config.quaternion.set(0, 0, 0, 1)
        config.velocity.set(0, 0, 0)
        config.acceleration.set(0, 0, 0)
        config.scale.min.set(1, 1, 1)
        config.scale.max.set(1, 1, 1)
        config.delay = 0
        config.lifetime = 1
        config.color.min.setRGB(1, 1, 1)
        config.color.max.setRGB(1, 1, 1)
        config.alpha.min = 1
        config.alpha.max = 1

        /* Run the setup function, when available */
        setup?.(config, i)

        /* First of all, write the particle's starting transform into the instance buffer. */
        imesh.current.setMatrixAt(
          cursor,
          tmpMatrix4.compose(
            config.position,
            config.quaternion,
            tmpScale.setScalar(1)
          )
        )

        /* Set times */
        const currentTime = imesh.current.material.uniforms.u_time.value
        attributes.time.setXY(
          cursor,
          currentTime + config.delay,
          currentTime + config.lifetime
        )

        /* Set velocity */
        attributes.velocity.setXYZ(
          cursor,
          ...(config.velocity.toArray() as [number, number, number])
        )

        /* Set acceleration */
        attributes.acceleration.setXYZ(
          cursor,
          ...(config.acceleration.toArray() as [number, number, number])
        )

        /* Set color */
        attributes.color0.setXYZW(
          cursor,
          config.color.min.r,
          config.color.min.g,
          config.color.min.b,
          config.alpha.min
        )
        attributes.color1.setXYZW(
          cursor,
          config.color.max.r,
          config.color.max.g,
          config.color.max.b,
          config.alpha.max
        )

        /* Set scale */
        attributes.scale0.setXYZ(
          cursor,
          ...(config.scale.min.toArray() as [number, number, number])
        )
        attributes.scale1.setXYZ(
          cursor,
          ...(config.scale.max.toArray() as [number, number, number])
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
