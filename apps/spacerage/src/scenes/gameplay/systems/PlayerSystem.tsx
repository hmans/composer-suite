import { archetype } from "miniplex"
import { plusMinus } from "randomish"
import { useRef } from "react"
import { Quaternion, Vector3 } from "three"
import { Stage } from "../../../configuration"
import { controller } from "../../../input"
import { System } from "../../../lib/miniplex-systems-runner/System"
import { spawnBullet } from "../Bullets"
import { ECS } from "../state"

const tmpQuat = new Quaternion()
const tmpVec3 = new Vector3()

export const PlayerSystem = () => {
  const entities = ECS.world.where(
    archetype("player", "rigidBody", "sceneObject")
  )
  const fireCooldown = useRef(0)

  return (
    <>
      <System
        name="Player Movement"
        world={ECS.world}
        updatePriority={Stage.Early}
        fun={() => {
          const [player] = entities
          if (!player) return

          const { move, aim } = controller.controls
          const rb = player.rigidBody

          const body = rb.raw()

          body.resetForces(true)
          body.resetTorques(true)
          player.sceneObject.getWorldQuaternion(tmpQuat)

          /* Rotate the player */
          const lookDirection = new Vector3(0, 1, 0).applyQuaternion(tmpQuat)
          const aimDirection = new Vector3(aim.x, aim.y, 0).normalize()
          const angle = lookDirection.angleTo(aimDirection)
          const cross = lookDirection.cross(aimDirection)
          if (cross.z) {
            const delta = angle / Math.PI
            const torque = Math.sign(cross.z) * Math.pow(delta, 2) * 300
            body.addTorque(tmpVec3.set(0, 0, torque), true)
          }

          /* Thrust */
          const thrust = tmpVec3.set(move.x * 100, move.y * 100, 0)

          body.addForce(thrust, true)
        }}
      />

      <System
        name="Player Firing"
        world={ECS.world}
        updatePriority={Stage.Normal}
        fun={(dt) => {
          const [player] = entities

          if (!player) return
          const body = player.rigidBody.raw()

          /* Fire? */
          fireCooldown.current -= dt

          const { fire } = controller.controls

          if (fire.value > 0.2 && fireCooldown.current <= 0) {
            const worldPosition = player.sceneObject.getWorldPosition(
              new Vector3()
            )

            spawnBullet(
              player.sceneObject
                .getWorldPosition(new Vector3())
                .add(new Vector3(-1.3, 0.5, 0).applyQuaternion(tmpQuat)),
              tmpQuat,

              new Vector3(0, 40, 0)
                .applyQuaternion(tmpQuat)
                .applyAxisAngle(new Vector3(0, 0, 1), plusMinus(0.02))
                .add(body.linvel() as Vector3)
            )

            spawnBullet(
              player.sceneObject
                .getWorldPosition(new Vector3())
                .add(new Vector3(+1.3, 0.5, 0).applyQuaternion(tmpQuat)),

              tmpQuat,

              new Vector3(0, 40, 0)
                .applyQuaternion(tmpQuat)
                .applyAxisAngle(new Vector3(0, 0, 1), plusMinus(0.02))
                .add(body.linvel() as Vector3)
            )

            fireCooldown.current = 0.065
          }
        }}
      />
    </>
  )
}
