import { collectFromTree, Unit } from "shader-composer"
import {
  BufferAttribute,
  BufferGeometry,
  InstancedMesh,
  InterleavedBufferAttribute,
  Material,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { ParticleAttribute } from "./ParticleAttribute"

export type InstanceSetupCallback = (config: {
  index: number
  position: Vector3
  rotation: Quaternion
  scale: Vector3
}) => void

/* A couple of temporary variables to avoid allocations */
const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3(1, 1, 1)
const tmpMatrix = new Matrix4()

export class Particles extends InstancedMesh<BufferGeometry> {
  public cursor: number = 0
  public capacity: number
  public safetyCapacity: number

  private attributeUnits: ParticleAttribute[] = []

  private uploadableAttributes: (
    | BufferAttribute
    | InterleavedBufferAttribute
  )[] = []

  private lastCursor = 0

  constructor(
    geometry: BufferGeometry | undefined,
    material: Material | undefined,
    capacity: number = 1000,
    safetyCapacity: number = capacity / 10
  ) {
    super(geometry, material, capacity + safetyCapacity)
    this.capacity = capacity
    this.safetyCapacity = safetyCapacity

    this.onBeforeRender = () => {
      const emitted = this.cursor - this.lastCursor

      if (emitted > 0) {
        this.uploadableAttributes.forEach((attribute) => {
          attribute.needsUpdate = true

          if (attribute instanceof BufferAttribute) {
            attribute.updateRange.offset = this.lastCursor * attribute.itemSize
            attribute.updateRange.count = emitted * attribute.itemSize
          }
        })

        /* If we've gone past the safe limit, go back to the beginning. */
        if (this.cursor >= this.capacity) {
          this.cursor = 0
        }
      }

      this.lastCursor = this.cursor
    }
  }

  public setupParticles(shaderRoot: Unit) {
    /* Let's go! */
    this.uploadableAttributes = []

    /* TODO: hopefully this can live in SC at some point. https://github.com/hmans/shader-composer/issues/60 */
    this.attributeUnits = collectFromTree(
      shaderRoot,
      "any",
      (item) => item.setupMesh
    )

    for (const unit of this.attributeUnits) {
      unit.setupMesh(this)
    }

    /* Build a list of attributes we will upload every frame. */
    const userAttributes = this.attributeUnits.map(
      (unit) => this.geometry.attributes[unit.name]
    )

    this.uploadableAttributes = [this.instanceMatrix, ...userAttributes]
  }

  public emit(count: number = 1, setupInstance?: InstanceSetupCallback) {
    /* Emit the requested number of particles. */
    for (let i = 0; i < count; i++) {
      /* Reset instance configuration values */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      /* Invoke setup callback, if given */
      setupInstance?.({
        index: this.cursor,
        position: tmpPosition,
        rotation: tmpRotation,
        scale: tmpScale
      })

      /* Store and upload matrix */
      this.setMatrixAt(
        this.cursor,
        tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale)
      )

      /* Write all known attributes */
      for (const unit of this.attributeUnits) {
        unit.setupParticle(this)
      }

      /* Advance cursor */
      this.cursor++
    }
  }
}
