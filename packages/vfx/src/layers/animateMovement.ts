import { Matrix4, Quaternion, Vector3 } from "three"
import { createShader } from "../lib/shadermaker"

const tmpMatrix4 = new Matrix4()
const tmpScale = new Vector3()

export default function() {
  const configurator = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    velocity: new Vector3(),
    acceleration: new Vector3()
  }

  return createShader({
    attributes: {
      velocity: { type: "vec3", itemSize: 3 },
      acceleration: { type: "vec3", itemSize: 3 }
    },

    vertexMain: `
      csm_Position += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration) * mat3(instanceMatrix);
    `,

    configurator,

    reset: (mesh) => {
      configurator.position.set(0, 0, 0)
      configurator.quaternion.set(0, 0, 0, 1)
      configurator.velocity.set(0, 0, 0)
      configurator.acceleration.set(0, 0, 0)
    },

    apply: (mesh, cursor) => {
      /* Set origin position of the instance */
      mesh.setMatrixAt(
        cursor,
        tmpMatrix4.compose(
          configurator.position,
          configurator.quaternion,
          tmpScale.setScalar(1)
        )
      )

      /* Set attributes */
      const { attributes } = mesh.geometry
      attributes.velocity.setXYZ(cursor, ...configurator.velocity.toArray())
      attributes.acceleration.setXYZ(
        cursor,
        ...configurator.acceleration.toArray()
      )
    }
  })
}
