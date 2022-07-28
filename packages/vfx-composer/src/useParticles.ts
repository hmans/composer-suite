/*
collect helper
*/

import { MutableRefObject, useMemo, useRef, useLayoutEffect } from "react"
import { Item, walkTree, Unit } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import {
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Vector3,
  Quaternion
} from "three"
import {
  EffectAgeUniform,
  isParticleAttribute,
  ParticleAttribute
} from "./units"

const collectFromTree = (root: Item, check: (item: Item) => boolean) => {
  const found = new Array<Item>()

  walkTree(root, (item) => {
    if (check(item)) {
      found.push(item)
    }
  })

  return found
}

export const makeAttribute = (count: number, itemSize: number) =>
  new InstancedBufferAttribute(new Float32Array(count * itemSize), itemSize)

/**
 * Prepares the given instanced mesh and returns an API for interacting with it.
 */
export const useParticles = (
  imesh: MutableRefObject<InstancedMesh>,
  masterFun: () => Unit
) => {
  const master = useMemo(masterFun, [])
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

  const spawn = (count: number = 1) => {
    if (!imesh.current) return

    const { geometry } = imesh.current

    for (let i = 0; i < count; i++) {
      /* Set the matrix at cursor */
      imesh.current.setMatrixAt(
        cursor,

        new Matrix4().compose(
          new Vector3().randomDirection(),
          new Quaternion().random(),
          new Vector3(1, 1, 1)
        )
      )

      /* Make up some lifetime */
      geometry.attributes.lifetime.setXY(
        cursor,
        EffectAgeUniform.value + 0,
        EffectAgeUniform.value + 1
      )
      geometry.attributes.lifetime.needsUpdate = true

      /* Genererate values for per-particle attributes */
      for (const unit of attributeUnits.current) {
        unit.setupParticle(imesh.current, cursor)
      }

      /* Advance cursor */
      cursor = (cursor + 1) % imesh.current.count

      imesh.current.instanceMatrix.needsUpdate = true
    }
  }

  return { spawn, shader }
}
