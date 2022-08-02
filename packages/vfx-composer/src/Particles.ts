import { collectFromTree } from "shader-composer"
import {
  BufferAttribute,
  BufferGeometry,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { ParticleAttribute } from "./units"
import { VFXMaterial } from "./VFXMaterial"

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

export class Particles extends InstancedMesh<BufferGeometry, VFXMaterial> {
  public cursor: number = 0
  public maxParticles: number
  public safetyBuffer: number

  private attributeUnits: ParticleAttribute[] = []
  private lastCursor = 0

  constructor(
    geometry: BufferGeometry | undefined,
    material: VFXMaterial | undefined,
    count: number,
    safetyBuffer: number = 100
  ) {
    super(geometry, material, count + safetyBuffer)
    this.maxParticles = count
    this.safetyBuffer = safetyBuffer

    this.onBeforeRender = () => {
      const emitted = this.cursor - this.lastCursor

      if (emitted > 0) {
        console.log(this.lastCursor, emitted)

        /* Mark all attribute ranges that need to be uploaded to the GPU this frame. */
        const allAttributes = [
          this.instanceMatrix,
          ...Object.values(this.geometry.attributes)
        ] as BufferAttribute[]

        allAttributes.forEach((attribute) => {
          attribute.needsUpdate = true
          // attribute.updateRange.offset = this.lastCursor * attribute.itemSize
          // attribute.updateRange.count = emitted * attribute.itemSize
        })

        /* If we've gone past the safe limit, go back to the beginning. */
        if (this.cursor >= this.maxParticles) {
          this.cursor = 0
        }
      }

      this.lastCursor = this.cursor
    }
  }

  public setupParticles() {
    /* TODO: hopefully this can live in SC at some point. https://github.com/hmans/shader-composer/issues/60 */
    if (this.material.shaderRoot) {
      this.attributeUnits = collectFromTree(
        this.material.shaderRoot,
        (item) => item.setupMesh
      )

      for (const unit of this.attributeUnits) {
        unit.setupMesh(this)
      }
    }
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
