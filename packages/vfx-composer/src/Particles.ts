import { collectFromTree } from "shader-composer"
import {
  BufferGeometry, InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { VFXMaterial } from "./VFXMaterial"
import { ParticleAttribute } from "./units"

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

export class Particles extends InstancedMesh<
  BufferGeometry,
  VFXMaterial
> {
  public cursor: number = 0
  private attributeUnits: ParticleAttribute[] = []

  constructor(...args: ConstructorParameters<typeof InstancedMesh<BufferGeometry, VFXMaterial>>) {
    super(...args)
  }

  public setupParticles() {
    /* TODO: hopefully this can live in SC at some point. https://github.com/hmans/shader-composer/issues/60 */
    if (this.material.shaderRoot) {
      this.attributeUnits = collectFromTree(this.material.shaderRoot, (item) => item.setupMesh)

      for (const unit of this.attributeUnits)  {
        unit.setupMesh(this)
      }
    }
  }

  public emit(count: number = 1, setupInstance?: InstanceSetupCallback) {
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

      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale)

      /* Store and upload matrix */
      this.setMatrixAt(this.cursor, tmpMatrix)
      this.instanceMatrix.needsUpdate = true

      /* Write all known attributes */
      for (const unit of this.attributeUnits) {
        unit.setupParticle(this)
      }

      /* Advance cursor */
      this.cursor = (this.cursor + 1) % this.count
    }
  }
}
