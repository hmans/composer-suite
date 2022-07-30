import { InstancedMesh, Matrix4, Quaternion, Vector3 } from "three"

export type InstanceSetupCallback = (
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3
) => void

/* A couple of temporary variables to avoid allocations */
const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3(1, 1, 1)
const tmpMatrix = new Matrix4()

export class Particles extends InstancedMesh {
  public cursor: number = 0

  public spawn(count: number = 1, setupInstance: InstanceSetupCallback) {
    for (let i = 0; i < count; i++) {
      /* Reset instance configuration values */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      /* Invoke setup callback, if given */
      setupInstance?.(tmpPosition, tmpRotation, tmpScale)

      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale)

      /* Store and upload matrix */
      this.setMatrixAt(this.cursor, tmpMatrix)
      this.instanceMatrix.needsUpdate = true

      /* Advance cursor */
      this.cursor = (this.cursor + 1) % this.count
    }
  }
}
