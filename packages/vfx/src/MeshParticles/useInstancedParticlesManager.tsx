import { MutableRefObject, useLayoutEffect, useMemo } from "react"
import {
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  ShaderMaterial
} from "three"
import { components, SpawnSetup } from "../ParticlesContext"
import { createAttributes, prepareInstancedMesh } from "../util/attributes"
import { tmpMatrix4, tmpScale } from "./MeshParticles"

export function useInstancedParticlesManager(
  imesh: MutableRefObject<InstancedMesh>,
  maxParticles: number,
  safetySize: number
) {
  /* The safetySize allows us to emit a batch of particles that would otherwise
     exceed the maximum instance count (which would make WebGL crash.) This way, we don't
     have to upload the entirety of all buffers every time the playhead wraps back to 0. */
  const maxInstanceCount = maxParticles + safetySize

  /* Let's define a number of attributes. */
  const attributes = useMemo(() => {
    return createAttributes(maxInstanceCount, InstancedBufferAttribute)
  }, [maxInstanceCount])

  /* Register the instance attributes with the imesh. */
  useLayoutEffect(() => prepareInstancedMesh(imesh.current, attributes), [
    attributes
  ])

  return useMemo(() => {
    /* The playhead acts as a cursor through our various buffer attributes. It automatically
       advances every time a new particle is spawned. */
    let playhead = 0

    /* This function will spawn new particles. */
    const spawnParticle = (
      count: number,
      setup?: SpawnSetup,
      origin?: Object3D
    ) => {
      const { instanceMatrix } = imesh.current

      /* Configure the attributes to upload only the updated parts to the GPU. */
      /* TODO: allow the user to call spawnParticles multiple times within the same frame */
      const allAttributes = [instanceMatrix, ...Object.values(attributes)]
      allAttributes.forEach((attribute) => {
        attribute.needsUpdate = true
        attribute.updateRange.offset = playhead * attribute.itemSize
        attribute.updateRange.count = count * attribute.itemSize
      })

      /* For every spawned particle, write some data into the attribute buffers. */
      for (let i = 0; i < count; i++) {
        /* Safety check: if we've reached the end of the buffers, it means the user picked a safety
           size too small for their use case. We don't want to crash the application, so let's log a
           warning and discard the particle. */
        if (playhead >= maxInstanceCount) {
          console.warn(
            "Spawned too many particles this frame. Discarding. Consider increasing the safetySize."
          )

          return
        }

        /* Reset components */
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

        /* TODO: Apply origin */
        // if (origin) {
        //   origin.getWorldPosition(components.position)
        //   origin.getWorldQuaternion(components.quaternion)
        //   origin.getWorldScale(components.scale[0])
        //   origin.getWorldScale(components.scale[1])
        // }
        /* Run setup */
        setup?.(components, i)

        imesh.current.setMatrixAt(
          playhead,
          tmpMatrix4.compose(
            components.position,
            components.quaternion,
            tmpScale.setScalar(1)
          )
        )

        /* Set times */
        const currentTime = (imesh.current.material as ShaderMaterial).uniforms
          .u_time.value
        attributes.time.setXY(
          playhead,
          currentTime + components.delay,
          currentTime + components.lifetime
        )

        /* Set velocity */
        attributes.velocity.setXYZ(playhead, ...components.velocity.toArray())

        /* Set acceleration */
        attributes.acceleration.setXYZ(
          playhead,
          ...components.acceleration.toArray()
        )

        /* Set color */
        attributes.color0.setXYZW(
          playhead,
          components.color[0].r,
          components.color[0].g,
          components.color[0].b,
          components.alpha[0]
        )
        attributes.color1.setXYZW(
          playhead,
          components.color[1].r,
          components.color[1].g,
          components.color[1].b,
          components.alpha[1]
        )

        /* Set scale */
        attributes.scale0.setXYZ(playhead, ...components.scale[0].toArray())
        attributes.scale1.setXYZ(playhead, ...components.scale[1].toArray())

        /* Advance playhead */
        playhead++
      }

      /* Increase count of imesh to match playhead */
      if (playhead > imesh.current.count) {
        imesh.current.count = playhead
      }

      /* If we've gone past the number of max particles, reset the playhead. */
      if (playhead > maxParticles) {
        playhead = 0
      }
    }

    return { spawnParticle }
  }, [attributes])
}
