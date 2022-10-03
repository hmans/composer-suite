import {
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Material,
  Matrix4,
  Quaternion,
  Vector3
} from "three"

export type InstanceSetupCallback = (config: {
  index: number
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  mesh: InstancedParticles
}) => void

/* A couple of temporary variables to avoid allocations */
const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3(1, 1, 1)
const tmpMatrix = new Matrix4()

export class InstancedParticles extends InstancedMesh<BufferGeometry> {
  /**
   * The total capacity of the particle system. This is the soft limit of
   * particles supported by this mesh. Once the particles emitted go beyond
   * this number, the cursor will wrap around to the beginning of the involved
   * buffer attributes.
   *
   * @default 1000
   */
  public capacity: number

  /**
   * The number of particles that _may_ be emitted beyond the soft limit defined
   * by `capacity`. This is used to avoid buffer overflows in situations where
   * multiple particles are uploaded within a single frame. You should make sure that
   * the size of this safety capacity is large enough to accommodate the maximum number
   * of particles you're spawning within a single frame, if this number is expected to
   * go beyond the particle system's `capacity`.
   *
   * @default capacity / 10
   */
  public safetyCapacity: number

  /**
   * The cursor tracking the position within buffers to write into. This
   * automatically advances every time you emit particles.
   */
  public cursor: number = 0
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
    this.count = 0

    this.onBeforeRender = () => {
      const emitted = this.cursor - this.lastCursor

      /* Increase total count of particles if we haven't done so before. */
      this.count = Math.max(this.count, this.cursor)

      if (emitted > 0) {
        const attrs = [
          this.instanceMatrix,
          ...Object.values(this.geometry.attributes)
        ]

        attrs.forEach((attribute) => {
          attribute.needsUpdate = true

          if (attribute instanceof InstancedBufferAttribute) {
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

  public emit(count: number = 1, setupInstance?: InstanceSetupCallback) {
    /* Emit the requested number of particles. */
    for (let i = 0; i < count; i++) {
      /* Reset instance configuration values */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      /* Invoke setup callback, if given */
      setupInstance?.({
        mesh: this,
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

      /* Advance cursor */
      this.cursor++
    }
  }
}
