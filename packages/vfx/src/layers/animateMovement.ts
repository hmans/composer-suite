import { Matrix4, Quaternion, Vector3 } from "three"
import { createShader } from "../shaders"

const tmpMatrix4 = new Matrix4()
const tmpScale = new Vector3()

export default function() {
  const config = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    velocity: new Vector3(),
    acceleration: new Vector3()
  }

  return createShader({
    attributes: {
      velocity: { type: "vec3" },
      acceleration: { type: "vec3" }
    },

    vertexMain: `
      /* Apply velocity */
      csm_Position += vec3(v_age * velocity) * mat3(instanceMatrix);

      /* Apply acceleration */
      csm_Position += vec3(0.5 * v_age * v_age * acceleration) * mat3(instanceMatrix);
    `,

    config,

    resetConfig: (mesh) => {
      config.position.set(0, 0, 0)
      config.quaternion.set(0, 0, 0, 1)
      config.velocity.set(0, 0, 0)
      config.acceleration.set(0, 0, 0)
    },

    applyConfig: (mesh, cursor) => {
      /* Set origin position of the instance */
      mesh.setMatrixAt(
        cursor,
        tmpMatrix4.compose(
          config.position,
          config.quaternion,
          tmpScale.setScalar(1)
        )
      )

      /* Set attributes */
      const { attributes } = mesh.geometry
      attributes.velocity.setXYZ(cursor, ...config.velocity.toArray())
      attributes.acceleration.setXYZ(cursor, ...config.acceleration.toArray())
    }
  })
}
