import { collectFromTree, Unit, walkTree } from "shader-composer"
import {
  BufferGeometry, InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { ParticlesMaterial } from "./ParticlesMaterial"

export type InstanceSetupCallback = (config: {
  cursor: number
  position: Vector3
  rotation: Quaternion
  scale: Vector3
}) => void

/* A couple of temporary variables to avoid allocations */
const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3(1, 1, 1)
const tmpMatrix = new Matrix4()

export class Particles extends InstancedMesh<
  BufferGeometry,
  ParticlesMaterial
> {
  public cursor: number = 0
  private attributeUnits: { setupMesh: (particles: Particles) => void }[]

  constructor(...args: ConstructorParameters<typeof InstancedMesh<BufferGeometry, ParticlesMaterial>>) {
    super(...args)

    /* TODO: hopefully this can live in SC at some point. https://github.com/hmans/shader-composer/issues/60 */
    this.attributeUnits = collectFromTree(this.material.shaderRoot, (item) => item.setupMesh)
    for (const unit of this.attributeUnits)  {
      unit.setupMesh(this)
    }
  }

  public spawn(count: number = 1, setupInstance?: InstanceSetupCallback) {
    for (let i = 0; i < count; i++) {
      /* Reset instance configuration values */
      tmpPosition.set(0, 0, 0)
      tmpRotation.set(0, 0, 0, 1)
      tmpScale.set(1, 1, 1)

      /* Invoke setup callback, if given */
      setupInstance?.({
        cursor: this.cursor,
        position: tmpPosition,
        rotation: tmpRotation,
        scale: tmpScale
      })

      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale)

      /* Store and upload matrix */
      this.setMatrixAt(this.cursor, tmpMatrix)
      this.instanceMatrix.needsUpdate = true

      /* Advance cursor */
      this.cursor = (this.cursor + 1) % this.count
    }
  }
}
