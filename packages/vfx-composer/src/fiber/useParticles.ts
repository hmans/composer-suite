import { MutableRefObject, useLayoutEffect, useRef } from "react"
import { collectFromTree, Unit } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { InstancedMesh, Matrix4, Quaternion, Vector3 } from "three"
import {
  EffectAgeUniform,
  isParticleAttribute,
  ParticleAttribute
} from "../units"
import { makeAttribute } from "../util/makeAttribute"

export type ParticleSetupCallback = (index: number) => void

export type SpawnOptions = {
  position?: (position: Vector3) => Vector3
  rotation?: (rotation: Quaternion) => Quaternion
  scale?: (scale: Vector3) => Vector3
  setup?: ParticleSetupCallback
}

const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3()
const tmpMatrix = new Matrix4()

/**
 * Prepares the given instanced mesh and returns an API for interacting with it.
 */
export const useParticles = (
  imesh: MutableRefObject<InstancedMesh>,
  master: Unit
) => {
  const attributeUnits = useRef<ParticleAttribute<any>[]>([])

  /* Let's compile the shader first. */
  const shader = useShader(() => master)

  /* Create attributes on the geometry */
  useLayoutEffect(() => {
    /* Prepare geometry */
    const { geometry, count } = imesh.current

    geometry.setAttribute("lifetime", makeAttribute(count, 2))

    attributeUnits.current = collectFromTree(master, isParticleAttribute)

    for (const unit of attributeUnits.current) {
      unit.setupMesh(imesh.current)
    }
  })

  let cursor = 0

  const spawn = (count: number = 1, opts: SpawnOptions = {}) => {
    if (!imesh.current) return

    const { geometry } = imesh.current

    for (let i = 0; i < count; i++) {
      /* Reset configuration variables */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      /* Set the matrix at cursor */
      imesh.current.setMatrixAt(
        cursor,

        tmpMatrix.compose(
          opts.position ? opts.position(tmpPosition) : tmpPosition,
          opts.rotation ? opts.rotation(tmpRotation) : tmpRotation,
          opts.scale ? opts.scale(tmpScale) : tmpScale
        )
      )

      /* Make up some lifetime */
      geometry.attributes.lifetime.setXY(
        cursor,
        EffectAgeUniform.value + 0,
        EffectAgeUniform.value + 4
      )
      geometry.attributes.lifetime.needsUpdate = true

      /* Genererate values for per-particle attributes */
      for (const unit of attributeUnits.current) {
        unit.setupParticle(imesh.current, cursor)
      }

      /* Invoke setup callback */
      opts.setup?.(cursor)

      /* Advance cursor */
      cursor = (cursor + 1) % imesh.current.count

      imesh.current.instanceMatrix.needsUpdate = true
    }
  }

  return { spawn, shader }
}
